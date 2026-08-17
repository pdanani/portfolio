import { eq, inArray, sql } from 'drizzle-orm'

import { getDb, schema } from './db'
import { itemMetadata, onlineAvailability, priceAndPromos, seedItems } from './costco-client'

import type { CatalogStats } from './types'

const PRICE_TTL_MS = Number(process.env.PRICE_TTL_MS ?? 6 * 60 * 60 * 1000)

export interface PricedItem {
  priceCents: number | null
  onlinePriceCents: number | null
  discountCents: number
  hasDeal: boolean
}

/** Hydrate metadata (image, category, child id, model) for one item if missing. */
export async function hydrateMetadata(itemId: number): Promise<string | null> {
  const db = getDb()
  const [item] = await db.select().from(schema.items).where(eq(schema.items.id, itemId)).limit(1)
  if (!item) return null
  if (item.costcoChildId && item.imageUrl) return item.costcoChildId
  if (!item.costcoItemNumber) return item.costcoChildId
  const [meta] = await itemMetadata([item.costcoItemNumber]).catch(() => [])
  if (!meta) return item.costcoChildId
  await db
    .update(schema.items)
    .set({
      costcoChildId: meta.costcoChildId,
      name: meta.name,
      brand: meta.brand,
      imageUrl: meta.imageUrl,
      category: meta.category,
      model: meta.model ?? item.model,
    })
    .where(eq(schema.items.id, itemId))
  return meta.costcoChildId
}

/** Hydrate + fetch/store price, deal, and real online availability. Snapshots the price. */
export async function priceItem(itemId: number, throttled = true): Promise<PricedItem | null> {
  const db = getDb()
  const childId = await hydrateMetadata(itemId)
  const ts = new Date().toISOString()
  if (!childId) {
    await db.update(schema.items).set({ lastPricedAt: ts }).where(eq(schema.items.id, itemId))
    return null
  }
  const price = await priceAndPromos(childId, '847', throttled).catch(() => null)
  if (!price) {
    await db.update(schema.items).set({ lastPricedAt: ts }).where(eq(schema.items.id, itemId))
    return null
  }
  const availability = await onlineAvailability(childId, '98101', 'WA', throttled).catch(
    () => 'unknown' as const,
  )
  const promo = price.promotions[0] ?? null
  const result: PricedItem = {
    priceCents: price.warehousePriceCents ?? price.onlinePriceCents,
    onlinePriceCents: price.onlinePriceCents,
    discountCents: price.discountCents,
    hasDeal: price.discountCents > 0 || promo != null,
  }
  await db
    .update(schema.items)
    .set({
      priceCents: result.priceCents,
      onlinePriceCents: result.onlinePriceCents,
      discountCents: result.discountCents,
      onlineAvailability: availability,
      dealShortText: promo?.shortText ?? null,
      dealLongText: promo?.longText ?? null,
      dealEndsAt: promo?.endDate ?? null,
      lastPricedAt: ts,
    })
    .where(eq(schema.items.id, itemId))
  await db.insert(schema.priceSnapshots).values({
    itemId,
    warehouseId: null,
    priceCents: result.onlinePriceCents,
    availability,
    source: 'costco',
    capturedAt: ts,
  })
  return result
}

/** Concurrently price a page of items, skipping fresh ones (TTL). */
export async function priceMany(itemIds: Array<number>, concurrency = 6): Promise<void> {
  if (itemIds.length === 0) return
  const db = getDb()
  const rows = await db
    .select({ id: schema.items.id, lastPricedAt: schema.items.lastPricedAt })
    .from(schema.items)
    .where(inArray(schema.items.id, itemIds))
  const stale = rows
    .filter((r) => Date.now() - (r.lastPricedAt ? Date.parse(r.lastPricedAt) : 0) >= PRICE_TTL_MS)
    .map((r) => r.id)
  let i = 0
  async function worker() {
    while (i < stale.length) {
      const id = stale[i++]
      await priceItem(id, false).catch(() => {})
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, stale.length) }, worker))
}

/** Price a bounded batch of never/least-recently priced items (deals engine). */
export async function dealScan(limit = 40): Promise<{ priced: number; deals: number }> {
  const db = getDb()
  const rows = await db
    .select({ id: schema.items.id })
    .from(schema.items)
    .orderBy(sql`${schema.items.lastPricedAt} ASC NULLS FIRST`)
    .limit(limit)
  let priced = 0
  let deals = 0
  let i = 0
  async function worker() {
    while (i < rows.length) {
      const row = rows[i++]
      const res = await priceItem(row.id, false).catch(() => null)
      if (res) {
        priced++
        if (res.hasDeal) deals++
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, rows.length) }, worker))
  return { priced, deals }
}

/** Seed the browsable index from Costco's product sitemaps (chunked multi-row inserts). */
export async function seedCatalog(): Promise<{ itemCount: number }> {
  const db = getDb()
  const seeds = await seedItems()
  const now = new Date().toISOString()
  const CHUNK = 500
  for (let i = 0; i < seeds.length; i += CHUNK) {
    const chunk = seeds.slice(i, i + CHUNK)
    await db
      .insert(schema.items)
      .values(
        chunk.map((s) => ({
          costcoItemNumber: s.costcoItemNumber,
          name: s.name,
          firstSeenAt: now,
          createdAt: now,
        })),
      )
      .onConflictDoNothing({ target: schema.items.costcoItemNumber })
  }
  return { itemCount: seeds.length }
}

export async function catalogStats(): Promise<CatalogStats> {
  const db = getDb()
  const [row] = await db
    .select({
      itemCount: sql<number>`count(*)::int`,
      pricedCount: sql<number>`count(${schema.items.priceCents})::int`,
      dealCount: sql<number>`coalesce(sum(case when ${schema.items.discountCents} > 0 then 1 else 0 end), 0)::int`,
    })
    .from(schema.items)
  return row ?? { itemCount: 0, pricedCount: 0, dealCount: 0 }
}
