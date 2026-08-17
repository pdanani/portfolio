import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/server/costco/auth'
import { addWatch, listWatches, removeWatch } from '#/server/costco/watches-service'
import { alertsConfigured, sendPush } from '#/server/costco/notify'

import type { WatchScope } from '#/server/costco/types'

export const Route = createFileRoute('/api/costco/watches')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        return Response.json({ watches: await listWatches(), alertsConfigured: alertsConfigured() })
      },

      // POST { itemId, scope } to add · POST { test: true } fires a test push
      POST: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const body = (await request.json().catch(() => ({}))) as {
          itemId?: number
          scope?: WatchScope
          test?: boolean
        }
        if (body.test) {
          if (!alertsConfigured()) {
            return Response.json({ error: 'Set NTFY_TOPIC to enable alerts' }, { status: 400 })
          }
          const ok = await sendPush("Test alert from Warehouse Watch — you're all set. ✅", {
            title: 'Warehouse Watch',
            tags: ['bell'],
          })
          return ok
            ? Response.json({ ok: true })
            : Response.json({ error: 'ntfy send failed' }, { status: 502 })
        }
        if (!body.itemId || (body.scope !== 'online' && body.scope !== 'warehouses')) {
          return Response.json(
            { error: "itemId and scope ('online' | 'warehouses') are required" },
            { status: 400 },
          )
        }
        return Response.json({ id: await addWatch(body.itemId, body.scope) })
      },

      DELETE: async ({ request }) => {
        const denied = requireAuth(request)
        if (denied) return denied
        const id = Number(new URL(request.url).searchParams.get('id'))
        if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
        await removeWatch(id)
        return Response.json({ ok: true })
      },
    },
  },
})
