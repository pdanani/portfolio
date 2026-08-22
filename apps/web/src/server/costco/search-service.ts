import { eq } from 'drizzle-orm'

import { getDb, schema } from './db'
import { searchCatalog } from './costco-search'
import { itemMetadata } from './costco-client'

export interface SearchedItem {
  itemId: number
  costcoItemNumber: string
  name: string
  brand: string | null
  category: string | null
  imageUrl: string | null
  model: string | null
  inWarehouse: boolean
}

/** Live Costco search; upserts every result so it's priceable/watchable locally. */
export async function searchAndUpsert(
  query: string,
  opts: { offset?: number; pageSize?: number; zip?: string } = {},
): Promise<{ items: Array<SearchedItem>; total: number }> {
  const db = getDb()
  const page = await searchCatalog(query, opts)
  const now = new Date().toISOString()
  const out: Array<SearchedItem> = []
  for (const r of page.items) {
    const [row] = await db
      .insert(schema.items)
      .values({
        costcoItemNumber: r.costcoItemNumber,
        costcoChildId: r.costcoChildId,
        name: r.name,
        brand: r.brand,
        imageUrl: r.imageUrl,
        category: r.category,
        model: r.model,
        inWarehouse: r.inWarehouse,
        uri: r.uri,
        firstSeenAt: now,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: schema.items.costcoItemNumber,
        set: {
          costcoChildId: r.costcoChildId,
          name: r.name,
          brand: r.brand,
          imageUrl: r.imageUrl,
          category: r.category,
          model: r.model,
          inWarehouse: r.inWarehouse,
          uri: r.uri,
        },
      })
      .returning({ id: schema.items.id })
    out.push({
      itemId: row.id,
      costcoItemNumber: r.costcoItemNumber,
      name: r.name,
      brand: r.brand,
      category: r.category,
      imageUrl: r.imageUrl,
      model: r.model,
      inWarehouse: r.inWarehouse,
    })
  }
  return { items: out, total: page.total }
}

/** Pull an item number out of a Costco URL or a raw number string. */
export function parseItemNumber(input: string): string | null {
  const s = input.trim()
  const m =
    s.match(/\/p\/[^/]*\/[^/]*\/(\d{5,})/) ??
    s.match(/\.product\.(\d{5,})\.html/) ??
    s.match(/\/(\d{5,})(?:[/?#]|$)/) ??
    s.match(/^(\d{5,})$/)
  return m?.[1] ?? null
}

/** Direct add by Costco URL / item number — finds items search can't (discontinued). */
export async function lookupItem(
  input: string,
): Promise<{ itemId: number; name: string } | null> {
  const itemNumber = parseItemNumber(input)
  if (!itemNumber) return null
  const db = getDb()
  const [existing] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.costcoItemNumber, itemNumber))
    .limit(1)
  const [meta] = await itemMetadata([itemNumber]).catch(() => [])
  if (!meta && !existing) return null
  if (meta) {
    const now = new Date().toISOString()
    const [row] = await db
      .insert(schema.items)
      .values({
        costcoItemNumber: meta.costcoItemNumber,
        costcoChildId: meta.costcoChildId,
        name: meta.name,
        brand: meta.brand,
        imageUrl: meta.imageUrl,
        category: meta.category,
        model: meta.model,
        firstSeenAt: now,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: schema.items.costcoItemNumber,
        set: {
          costcoChildId: meta.costcoChildId,
          name: meta.name,
          brand: meta.brand,
          imageUrl: meta.imageUrl,
          category: meta.category,
          model: meta.model,
        },
      })
      .returning({ id: schema.items.id })
    return { itemId: row.id, name: meta.name }
  }
  return existing ? { itemId: existing.id, name: existing.name } : null
}
