import { eq } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { getDb, schema } from '#/server/costco/db'
import { toRow } from '#/server/costco/inventory-service'
import { priceItem } from '#/server/costco/pricing'
import { checkTrackedWarehouses, scanRegion } from '#/server/costco/items-service'

const PRICE_TTL_MS = Number(process.env.PRICE_TTL_MS ?? 6 * 60 * 60 * 1000)

async function loadItem(id: number) {
  const db = getDb()
  const [item] = await db.select().from(schema.items).where(eq(schema.items.id, id)).limit(1)
  return item ?? null
}

export const Route = createFileRoute('/api/costco/items/$id')({
  server: {
    handlers: {
      // GET -> full item row
      GET: async ({ request, params }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const item = await loadItem(Number(params.id))
        if (!item) return Response.json({ error: 'Item not found' }, { status: 404 })
        return Response.json({ row: toRow(item) })
      },

      // POST { action: 'price' | 'stock' | 'scan', region?, force? }
      POST: async ({ request, params }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const itemId = Number(params.id)
        const item = await loadItem(itemId)
        if (!item) return Response.json({ error: 'Item not found' }, { status: 404 })
        const body = (await request.json().catch(() => ({}))) as {
          action?: string
          region?: string
          force?: boolean
        }
        try {
          switch (body.action) {
            case 'price': {
              const fresh =
                item.lastPricedAt && Date.now() - Date.parse(item.lastPricedAt) < PRICE_TTL_MS
              if (!fresh || body.force) await priceItem(itemId)
              const updated = await loadItem(itemId)
              return Response.json({ row: toRow(updated!) })
            }
            case 'stock':
              return Response.json(await checkTrackedWarehouses(itemId))
            case 'scan':
              return Response.json(await scanRegion(itemId, body.region ?? 'northeast'))
            default:
              return Response.json({ error: 'Unknown action' }, { status: 400 })
          }
        } catch (err) {
          const e = err as Error & { statusCode?: number }
          return Response.json({ error: e.message }, { status: e.statusCode ?? 500 })
        }
      },
    },
  },
})
