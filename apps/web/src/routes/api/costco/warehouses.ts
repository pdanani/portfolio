import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { listTracked, searchByZip, track, untrack } from '#/server/costco/warehouses-service'

export const Route = createFileRoute('/api/costco/warehouses')({
  server: {
    handlers: {
      // GET /api/costco/warehouses            -> tracked list
      // GET /api/costco/warehouses?zip=98105  -> ZIP search
      GET: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const zip = new URL(request.url).searchParams.get('zip')
        if (zip) {
          if (!/^\d{5}$/.test(zip)) {
            return Response.json({ error: 'Provide a 5-digit ZIP code' }, { status: 400 })
          }
          return Response.json({ results: await searchByZip(zip) })
        }
        return Response.json({ warehouses: await listTracked() })
      },

      POST: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const body = (await request.json().catch(() => null)) as {
          name?: string
          address?: string | null
          postalCode?: string | null
          warehouseNumber?: string
        } | null
        if (!body?.name || !body.warehouseNumber) {
          return Response.json({ error: 'name and warehouseNumber are required' }, { status: 400 })
        }
        const id = await track({
          name: body.name,
          address: body.address ?? null,
          postalCode: body.postalCode ?? null,
          warehouseNumber: body.warehouseNumber,
        })
        return Response.json({ id })
      },

      DELETE: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const id = Number(new URL(request.url).searchParams.get('id'))
        if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
        await untrack(id)
        return Response.json({ ok: true })
      },
    },
  },
})
