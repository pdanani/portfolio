import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { getInventory } from '#/server/costco/inventory-service'

import type { InventorySort } from '#/server/costco/types'

const SORTS: Array<InventorySort> = ['name', 'price_asc', 'price_desc', 'newest', 'biggest_savings']

export const Route = createFileRoute('/api/costco/inventory')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const p = new URL(request.url).searchParams
        const warehouseRaw = p.get('warehouse') ?? 'all'
        const sortRaw = p.get('sort') as InventorySort | null
        try {
          const result = await getInventory({
            warehouse: warehouseRaw === 'all' ? 'all' : Number(warehouseRaw),
            q: p.get('q') ?? undefined,
            category: p.get('category') ?? undefined,
            sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : 'name',
            dealsOnly: p.get('dealsOnly') === 'true',
            page: Math.max(1, Number(p.get('page') ?? 1)),
            pageSize: Math.min(100, Math.max(1, Number(p.get('pageSize') ?? 24))),
          })
          return Response.json(result)
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : 'Inventory failed' },
            { status: 500 },
          )
        }
      },
    },
  },
})
