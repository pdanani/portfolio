import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { costcoApi } from '#/lib/costco/api'

export const Route = createFileRoute('/costco/alerts')({ component: AlertsPage })

function AlertsPage() {
  const queryClient = useQueryClient()
  const watchesQuery = useQuery({ queryKey: ['costco', 'watches'], queryFn: costcoApi.watches })

  const remove = useMutation({
    mutationFn: (id: number) => costcoApi.removeWatch(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['costco', 'watches'] }),
  })
  const test = useMutation({ mutationFn: () => costcoApi.testAlert() })

  const watches = watchesQuery.data?.watches ?? []
  const configured = watchesQuery.data?.alertsConfigured

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Stock alerts</h2>
        <button
          onClick={() => test.mutate()}
          disabled={!configured || test.isPending}
          className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {test.isPending ? 'sending…' : 'Send test alert'}
        </button>
      </div>
      {test.isSuccess && (
        <p className="font-mono text-xs text-emerald-300">Test sent — check your phone.</p>
      )}
      {test.isError && (
        <p className="font-mono text-xs text-destructive">{(test.error as Error).message}</p>
      )}

      {configured === false && (
        <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-sm">
          Alerts aren't configured yet — set <code className="font-mono">NTFY_TOPIC</code> in the
          environment and subscribe to that topic in the ntfy app on your phone.
        </p>
      )}

      {watchesQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : watches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No alerts yet. Open any item and tap <b>Back online</b> or <b>In my warehouses</b>.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {watches.map((w) => (
            <li
              key={w.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              {w.imageUrl ? (
                <img src={w.imageUrl} alt="" className="h-11 w-11 rounded-md bg-white object-contain" />
              ) : (
                <div className="h-11 w-11 rounded-md bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{w.itemName}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {w.scope === 'online' ? 'back online' : 'in my warehouses'} ·{' '}
                  <span className={w.inStock ? 'text-emerald-300' : ''}>
                    {w.inStock ? 'in stock now' : 'waiting'}
                  </span>
                  {w.lastCheckedAt &&
                    ` · checked ${new Date(w.lastCheckedAt).toLocaleTimeString()}`}
                </p>
              </div>
              <button
                onClick={() => remove.mutate(w.id)}
                className="font-mono text-xs text-muted-foreground hover:text-destructive"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
