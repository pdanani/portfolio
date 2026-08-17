import { createFileRoute } from '@tanstack/react-router'

import { requireCronSecret } from '#/server/costco/auth'
import { checkAllWatches } from '#/server/costco/watches-service'

/**
 * Back-in-stock poller. Hit by an external scheduler (cron-job.org / GitHub
 * Actions) every ~10 minutes with the CRON_SECRET. Stateless: reads watches
 * from Neon, re-checks Costco, pushes to ntfy only on out→in transitions.
 */
export const Route = createFileRoute('/api/costco/poll')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = requireCronSecret(request)
        if (denied) return denied
        const result = await checkAllWatches()
        return Response.json(result)
      },
    },
  },
})
