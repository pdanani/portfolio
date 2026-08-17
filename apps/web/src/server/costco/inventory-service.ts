import { and, asc, desc, eq, gt, inArray, sql } from 'drizzle-orm'

import { getDb, schema } from './db'
import { searchAndUpsert } from './search-service'
import { priceMany } from './pricing'

import type { SQL } from 'drizzle-orm'
import type { Availability, InventoryResponse, InventoryRow, InventorySort } from './types'

const { items, warehouseItems, warehouses } = schema

export interface InventoryQuery {
  warehouse: number | 'all'
  q?: string
  category?: string
  sort: InventorySort
  dealsOnly: boolean
  page: number
  pageSize: number
}

async function warehouseAvailabilityFor(
  itemIds: Array<number>,
  warehouse: number | 'all',
): Promise<Map<number, InventoryRow['warehouseAvailability']>> {
  const byItem = new Map<number, InventoryRow['warehouseAvailability']>()
  if (itemIds.length === 0) return byItem
  const db = getDb()
  const scope: SQL =
    warehouse === 'all' ? eq(warehouses.tracked, true) : eq(warehouseItems.warehouseId, warehouse)
  const rows = await db
    .select({
      itemId: warehouseItems.itemId,
      warehouseId: warehouseItems.warehouseId,
      warehouseName: warehouses.name,
      availability: warehouseItems.availability,
      checkedAt: warehouseItems.checkedAt,
    })
    .from(warehouseItems)
    .innerJoin(warehouses, eq(warehouses.id, warehouseItems.warehouseId))
    .where(and(scope, inArray(warehouseItems.itemId, itemIds)))
  for (const r of rows) {
    const list = byItem.get(r.itemId) ?? []
    list.push({
      warehouseId: r.warehouseId,
      warehouseName: r.warehouseName,
      availability: r.availability as Availability,
      checkedAt: r.checkedAt,
    })
    byItem.set(r.itemId, list)
  }
  return byItem
}

type ItemRecord = typeof schema.items.$inferSelect

export function toRow(
  r: ItemRecord,
  avail: InventoryRow['warehouseAvailability'] = [],
): InventoryRow {
  return {
    itemId: r.id,
    name: r.name,
    brand: r.brand,
    imageUrl: r.imageUrl,
    category: r.category,
    size: r.size,
    model: r.model,
    costcoItemNumber: r.costcoItemNumber,
    costcoChildId: r.costcoChildId,
    priceCents: r.priceCents,
    onlinePriceCents: r.onlinePriceCents,
    discountCents: r.discountCents,
    onlineAvailability: r.onlineAvailability as Availability,
    deal:
      r.discountCents > 0 || r.dealShortText
        ? {
            shortText: r.dealShortText,
            longText: r.dealLongText,
            discountCents: r.discountCents,
            endsAt: r.dealEndsAt,
          }
        : null,
    warehouseAvailability: avail,
  }
}

export async function getInventory(query: InventoryQuery): Promise<InventoryResponse> {
  const db = getDb()
  const { warehouse, q, category, sort, dealsOnly, page, pageSize } = query

  // A search query goes live to Costco's full catalog and self-heals ours.
  if (q && q.trim().length >= 2 && !dealsOnly) {
    try {
      const [zipRow] = await db
        .select({ postalCode: warehouses.postalCode })
        .from(warehouses)
        .where(eq(warehouses.tracked, true))
        .limit(1)
      const searched = await searchAndUpsert(q.trim(), {
        offset: (page - 1) * pageSize,
        pageSize,
        zip: zipRow?.postalCode ?? undefined,
      })
      const ids = searched.items.map((s) => s.itemId)
      await priceMany(ids)
      const availByItem = await warehouseAvailabilityFor(ids, warehouse)
      const records = ids.length ? await db.select().from(items).where(inArray(items.id, ids)) : []
      const byId = new Map(records.map((r) => [r.id, r]))
      const rows = ids
        .map((id) => byId.get(id))
        .filter((r): r is ItemRecord => r != null)
        .map((r) => toRow(r, availByItem.get(r.id) ?? []))
      return {
        rows,
        total: searched.total,
        page,
        pageSize,
        categories: [...new Set(rows.map((r) => r.category).filter((c): c is string => !!c))].sort(),
      }
    } catch {
      // fall through to the local catalog below
    }
  }

  const filters: Array<SQL> = []
  if (q) {
    const pattern = `%${q}%`
    filters.push(sql`(${items.name} ILIKE ${pattern} OR ${items.brand} ILIKE ${pattern})`)
  }
  if (category) filters.push(eq(items.category, category))
  if (dealsOnly) filters.push(gt(items.discountCents, 0))
  const where = filters.length ? and(...filters) : undefined

  const orderings: Record<InventorySort, Array<SQL>> = {
    name: [asc(items.name) as unknown as SQL],
    price_asc: [sql`${items.priceCents} ASC NULLS LAST`],
    price_desc: [sql`${items.priceCents} DESC NULLS LAST`],
    newest: [desc(items.firstSeenAt) as unknown as SQL],
    biggest_savings: [desc(items.discountCents) as unknown as SQL],
  }

  const pageRows = await db
    .select()
    .from(items)
    .where(where)
    .orderBy(...orderings[sort], asc(items.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const [totalRow] = await db.select({ n: sql<number>`count(*)::int` }).from(items).where(where)
  const categoryRows = await db.selectDistinct({ category: items.category }).from(items)

  const ids = pageRows.map((r) => r.id)
  const availByItem = await warehouseAvailabilityFor(ids, warehouse)

  return {
    rows: pageRows.map((r) => toRow(r, availByItem.get(r.id) ?? [])),
    total: totalRow?.n ?? 0,
    page,
    pageSize,
    categories: categoryRows
      .map((c) => c.category)
      .filter((c): c is string => c !== null)
      .sort(),
  }
}
