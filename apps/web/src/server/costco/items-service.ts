import { eq } from 'drizzle-orm'

import { getDb, schema } from './db'
import { warehouseStockBatch, warehousesInRegion, REGIONS } from './costco-client'
import { hydrateMetadata } from './pricing'

import type { CrossWarehouseHit } from './types'

const RANK: Record<string, number> = { in_stock: 0, low_stock: 1, out_of_stock: 2, not_sold: 3, unknown: 4 }

/** Real per-warehouse stock across tracked warehouses; persists results. */
export async function checkTrackedWarehouses(itemId: number): Promise<{
  hits: Array<CrossWarehouseHit>
  status: 'checked' | 'not_sold' | 'no_warehouses'
}> {
  const db = getDb()
  const childId = await hydrateMetadata(itemId)
  if (!childId) throw Object.assign(new Error('Item has no inventory id'), { statusCode: 400 })
  const tracked = await db.select().from(schema.warehouses).where(eq(schema.warehouses.tracked, true))
  if (tracked.length === 0) return { hits: [], status: 'no_warehouses' }

  const numbers = tracked.map((w) => w.costcoWarehouseNumber).filter((n): n is string => n != null)
  const stock = await warehouseStockBatch(childId, numbers, 6)
  const now = new Date().toISOString()
  const hits: Array<CrossWarehouseHit> = []
  let anyCarried = false
  for (const w of tracked) {
    const s = w.costcoWarehouseNumber ? stock.get(w.costcoWarehouseNumber) : undefined
    const carried = s?.carried ?? false
    if (carried) anyCarried = true
    const availability = s?.availability ?? 'unknown'
    await db
      .insert(schema.warehouseItems)
      .values({ warehouseId: w.id, itemId, availability, checkedAt: now })
      .onConflictDoUpdate({
        target: [schema.warehouseItems.warehouseId, schema.warehouseItems.itemId],
        set: { availability, checkedAt: now },
      })
    hits.push({
      warehouseName: w.name,
      address: w.address,
      stockStatus: carried ? availability : 'not_sold',
    })
  }
  return { hits, status: anyCarried ? 'checked' : 'not_sold' }
}

/** One item across every warehouse in a region (concurrency-capped for serverless). */
export async function scanRegion(
  itemId: number,
  region: string,
): Promise<{ region: string; scanned: number; inStockCount: number; hits: Array<CrossWarehouseHit> }> {
  if (!REGIONS[region]) throw Object.assign(new Error(`Unknown region "${region}"`), { statusCode: 400 })
  const childId = await hydrateMetadata(itemId)
  if (!childId) throw Object.assign(new Error('Item has no inventory id'), { statusCode: 400 })

  const list = await warehousesInRegion(region)
  const stock = await warehouseStockBatch(childId, list.map((w) => w.warehouseNumber), 10)

  const hits: Array<CrossWarehouseHit> = list
    .map((w) => {
      const s = stock.get(w.warehouseNumber) ?? { availability: 'unknown' as const, carried: false }
      return {
        warehouseName: `${w.name}${w.state ? `, ${w.state}` : ''}`,
        address: w.address,
        stockStatus: s.carried ? s.availability : 'not_sold',
      }
    })
    .sort((a, b) => (RANK[a.stockStatus] ?? 5) - (RANK[b.stockStatus] ?? 5))

  const inStockCount = hits.filter(
    (h) => h.stockStatus === 'in_stock' || h.stockStatus === 'low_stock',
  ).length
  return { region: REGIONS[region].label, scanned: list.length, inStockCount, hits }
}
