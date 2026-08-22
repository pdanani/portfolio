import { createFileRoute } from '@tanstack/react-router'

import {
  checkPassword,
  clearedCookie,
  isAuthed,
  sessionCookie,
} from '#/server/costco/auth'

export const Route = createFileRoute('/api/costco/auth')({
  server: {
    handlers: {
      GET: ({ request }) =>
        isAuthed(request)
          ? Response.json({ ok: true })
          : Response.json({ error: 'unauthorized' }, { status: 401 }),

      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          password?: string
        }
        if (!checkPassword(body.password ?? '')) {
          return Response.json({ error: 'Wrong password' }, { status: 401 })
        }
        return Response.json(
          { ok: true },
          { headers: { 'set-cookie': sessionCookie() } },
        )
      },

      DELETE: () =>
        Response.json(
          { ok: true },
          { headers: { 'set-cookie': clearedCookie() } },
        ),
    },
  },
})
