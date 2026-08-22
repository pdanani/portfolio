import { and, eq } from 'drizzle-orm'

import { getDb, schema } from './db'
import { onlineAvailability, warehouseStockBatch } from './costco-client'
import { hydrateMetadata } from './pricing'
import { sendPush } from './notify'

import type { Availability, Watch, WatchScope } from './types'

const IN_STOCK = new Set<Availability>(['in_stock', 'low_stock'])

export async function listWatches(): Promise<Array<Watch>> {
  const db = getDb()
  const rows = await db
    .select({
      id: schema.watches.id,
      itemId: schema.watches.itemId,
      scope: schema.watches.scope,
      wasInStock: schema.watches.wasInStock,
      detail: schema.watches.detail,
      createdAt: schema.watches.createdAt,
      lastCheckedAt: schema.watches.lastCheckedAt,
      lastNotifiedAt: schema.watches.lastNotifiedAt,
      itemName: schema.items.name,
      imageUrl: schema.items.imageUrl,
      costcoItemNumber: schema.items.costcoItemNumber,
    })
    .from(schema.watches)
    .innerJoin(schema.items, eq(schema.items.id, schema.watches.itemId))
  return rows.map((r) => ({
    id: r.id,
    itemId: r.itemId,
    itemName: r.itemName,
    imageUrl: r.imageUrl,
    costcoItemNumber: r.costcoItemNumber,
    scope: r.scope as WatchScope,
    inStock: r.wasInStock,
    detail: r.detail,
    createdAt: r.createdAt,
    lastCheckedAt: r.lastCheckedAt,
    lastNotifiedAt: r.lastNotifiedAt,
  }))
}

export async function addWatch(
  itemId: number,
  scope: WatchScope,
): Promise<number> {
  const db = getDb()
  const [existing] = await db
    .select({ id: schema.watches.id })
    .from(schema.watches)
    .where(
      and(eq(schema.watches.itemId, itemId), eq(schema.watches.scope, scope)),
    )
    .limit(1)
  if (existing) return existing.id
  const [row] = await db
    .insert(schema.watches)
    .values({
      itemId,
      scope,
      wasInStock: false,
      createdAt: new Date().toISOString(),
    })
    .returning({ id: schema.watches.id })
  // Seed current state so the first poll doesn't false-fire.
  await checkOne(row.id, false).catch(() => {})
  return row.id
}

export async function removeWatch(id: number): Promise<void> {
  await getDb().delete(schema.watches).where(eq(schema.watches.id, id))
}

async function evaluate(
  itemId: number,
  scope: WatchScope,
): Promise<{ inStock: boolean; detail: string | null } | null> {
  const db = getDb()
  const childId = await hydrateMetadata(itemId)
  if (!childId) return null

  if (scope === 'online') {
    const avail = await onlineAvailability(childId, '98101', 'WA', false).catch(
      () => 'unknown' as Availability,
    )
    return { inStock: IN_STOCK.has(avail), detail: avail }
  }

  const tracked = await db
    .select()
    .from(schema.warehouses)
    .where(eq(schema.warehouses.tracked, true))
  const numbers = tracked
    .map((w) => w.costcoWarehouseNumber)
    .filter((n): n is string => n != null)
  const stock = await warehouseStockBatch(childId, numbers, 6)
  const inStockAt = tracked
    .filter((w) => {
      const s = w.costcoWarehouseNumber
        ? stock.get(w.costcoWarehouseNumber)
        : undefined
      return s?.carried && IN_STOCK.has(s.availability)
    })
    .map((w) => w.name)
  return { inStock: inStockAt.length > 0, detail: inStockAt.join(', ') || null }
}

async function checkOne(watchId: number, notify: boolean): Promise<boolean> {
  const db = getDb()
  const [watch] = await db
    .select()
    .from(schema.watches)
    .where(eq(schema.watches.id, watchId))
    .limit(1)
  if (!watch) return false
  const [item] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.id, watch.itemId))
    .limit(1)
  const outcome = await evaluate(watch.itemId, watch.scope as WatchScope)
  const now = new Date().toISOString()
  if (!outcome) {
    await db
      .update(schema.watches)
      .set({ lastCheckedAt: now })
      .where(eq(schema.watches.id, watchId))
    return false
  }
  const restocked = notify && !watch.wasInStock && outcome.inStock
  await db
    .update(schema.watches)
    .set({
      wasInStock: outcome.inStock,
      detail: outcome.detail,
      lastCheckedAt: now,
      ...(restocked ? { lastNotifiedAt: now } : {}),
    })
    .where(eq(schema.watches.id, watchId))
  if (restocked && item) {
    const where =
      watch.scope === 'online'
        ? 'online'
        : outcome.detail
          ? `at ${outcome.detail}`
          : 'at a warehouse'
    await sendPush(`🛒 ${item.name} is back in stock ${where}.`, {
      title: 'Back in stock',
      tags: ['white_check_mark'],
      priority: 4,
      clickUrl: process.env.PUBLIC_URL
        ? `${process.env.PUBLIC_URL}/costco`
        : undefined,
    })
  }
  return restocked
}

/** Poll entry point (hit by the external scheduler). */
export async function checkAllWatches(): Promise<{
  checked: number
  notified: number
}> {
  const db = getDb()
  const ids = (
    await db.select({ id: schema.watches.id }).from(schema.watches)
  ).map((r) => r.id)
  let notified = 0
  for (const id of ids) {
    if (await checkOne(id, true).catch(() => false)) notified++
  }
  return { checked: ids.length, notified }
}
