import { eq, sql } from 'drizzle-orm'

import { getDb, schema } from './db'
import { searchWarehousesByZip } from './costco-client'

import type { WarehouseInfo, WarehouseSearchResult } from './types'

export async function listTracked(): Promise<Array<WarehouseInfo>> {
  const db = getDb()
  const rows = await db.select().from(schema.warehouses).where(eq(schema.warehouses.tracked, true))
  const out: Array<WarehouseInfo> = []
  for (const w of rows) {
    const [count] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.warehouseItems)
      .where(eq(schema.warehouseItems.warehouseId, w.id))
    out.push({
      id: w.id,
      name: w.name,
      address: w.address,
      postalCode: w.postalCode,
      costcoWarehouseNumber: w.costcoWarehouseNumber,
      tracked: w.tracked,
      itemCount: count?.n ?? 0,
    })
  }
  return out
}

export async function searchByZip(zip: string): Promise<Array<WarehouseSearchResult>> {
  const db = getDb()
  const found = await searchWarehousesByZip(zip)
  const results: Array<WarehouseSearchResult> = []
  for (const f of found) {
    const [existing] = await db
      .select()
      .from(schema.warehouses)
      .where(eq(schema.warehouses.costcoWarehouseNumber, f.warehouseNumber))
      .limit(1)
    results.push({ ...f, alreadyTrackedWarehouseId: existing?.tracked ? existing.id : null })
  }
  return results
}

export async function track(
  body: Pick<WarehouseSearchResult, 'name' | 'address' | 'postalCode' | 'warehouseNumber'>,
): Promise<number> {
  const db = getDb()
  const [existing] = await db
    .select()
    .from(schema.warehouses)
    .where(eq(schema.warehouses.costcoWarehouseNumber, body.warehouseNumber))
    .limit(1)
  if (existing) {
    await db.update(schema.warehouses).set({ tracked: true }).where(eq(schema.warehouses.id, existing.id))
    return existing.id
  }
  const [row] = await db
    .insert(schema.warehouses)
    .values({
      name: body.name,
      address: body.address,
      postalCode: body.postalCode,
      costcoWarehouseNumber: body.warehouseNumber,
      tracked: true,
      createdAt: new Date().toISOString(),
    })
    .returning({ id: schema.warehouses.id })
  return row.id
}

export async function untrack(id: number): Promise<void> {
  const db = getDb()
  await db.update(schema.warehouses).set({ tracked: false }).where(eq(schema.warehouses.id, id))
  await db.delete(schema.warehouseItems).where(eq(schema.warehouseItems.warehouseId, id))
}
