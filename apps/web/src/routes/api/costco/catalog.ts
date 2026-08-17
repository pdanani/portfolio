import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { catalogStats, dealScan, seedCatalog } from '#/server/costco/pricing'

export const Route = createFileRoute('/api/costco/catalog')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        return Response.json(await catalogStats())
      },

      // POST { action: 'seed' } | { action: 'deal-scan', limit? }
      POST: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const body = (await request.json().catch(() => ({}))) as { action?: string; limit?: number }
        if (body.action === 'seed') return Response.json(await seedCatalog())
        if (body.action === 'deal-scan') {
          return Response.json(await dealScan(Math.min(60, body.limit ?? 40)))
        }
        return Response.json({ error: 'Unknown action' }, { status: 400 })
      },
    },
  },
})
