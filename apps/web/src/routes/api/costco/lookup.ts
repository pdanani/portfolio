import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { lookupItem } from '#/server/costco/search-service'
import { priceItem } from '#/server/costco/pricing'

export const Route = createFileRoute('/api/costco/lookup')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const body = (await request.json().catch(() => ({}))) as { query?: string }
        const query = body.query?.trim()
        if (!query) return Response.json({ error: 'Provide a Costco URL or item number' }, { status: 400 })
        const found = await lookupItem(query)
        if (!found) return Response.json({ error: "Couldn't find that item on Costco" }, { status: 404 })
        await priceItem(found.itemId).catch(() => {})
        return Response.json(found)
      },
    },
  },
})
