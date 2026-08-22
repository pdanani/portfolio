import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { costcoApi } from '#/lib/costco/api'

import type { WarehouseSearchResult } from '#/server/costco/types'

export const Route = createFileRoute('/costco/warehouses')({
  component: WarehousesPage,
})

function WarehousesPage() {
  const queryClient = useQueryClient()
  const [zip, setZip] = useState('')
  const [results, setResults] = useState<Array<WarehouseSearchResult> | null>(
    null,
  )

  const warehouses = useQuery({
    queryKey: ['costco', 'warehouses'],
    queryFn: costcoApi.warehouses,
  })
  const stats = useQuery({
    queryKey: ['costco', 'catalog'],
    queryFn: costcoApi.catalogStats,
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['costco', 'warehouses'] })
    void queryClient.invalidateQueries({ queryKey: ['costco', 'catalog'] })
  }

  const search = useMutation({
    mutationFn: () => costcoApi.searchWarehouses(zip),
    onSuccess: (d) => setResults(d.results),
  })
  const track = useMutation({
    mutationFn: (w: WarehouseSearchResult) => costcoApi.trackWarehouse(w),
    onSuccess: invalidate,
  })
  const untrack = useMutation({
    mutationFn: (id: number) => costcoApi.untrackWarehouse(id),
    onSuccess: invalidate,
  })
  const seed = useMutation({
    mutationFn: () => costcoApi.seedCatalog(),
    onSuccess: invalidate,
  })
  const dealScanRun = useMutation({
    mutationFn: () => costcoApi.dealScan(),
    onSuccess: invalidate,
  })

  const tracked = warehouses.data?.warehouses ?? []

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold">Catalog</h2>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {stats.data
                ? `${stats.data.itemCount.toLocaleString()} items · ${stats.data.pricedCount.toLocaleString()} priced · ${stats.data.dealCount.toLocaleString()} deals`
                : '…'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending}
              className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {seed.isPending ? 'seeding…' : 'Seed catalog'}
            </button>
            <button
              onClick={() => dealScanRun.mutate()}
              disabled={dealScanRun.isPending}
              className="rounded-md border border-brand/40 px-3 py-1.5 font-mono text-xs text-brand disabled:opacity-50"
            >
              {dealScanRun.isPending ? 'scanning…' : 'Scan for deals'}
            </button>
          </div>
        </div>
        {dealScanRun.isSuccess && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            priced {dealScanRun.data.priced}, found {dealScanRun.data.deals}{' '}
            deals — run again to keep going
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold">
          Find warehouses
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (/^\d{5}$/.test(zip)) search.mutate()
          }}
          className="flex gap-2"
        >
          <input
            value={zip}
            onChange={(e) =>
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5))
            }
            placeholder="ZIP code"
            inputMode="numeric"
            className="w-32 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={!/^\d{5}$/.test(zip) || search.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {search.isPending ? 'Searching…' : 'Search'}
          </button>
        </form>

        {results && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No warehouses found for {zip}.
              </li>
            )}
            {results.map((r) => (
              <li
                key={r.warehouseNumber}
                className="rounded-lg border border-border bg-card p-3"
              >
                <p className="text-sm font-medium">{r.name}</p>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {r.address ?? ''}
                </p>
                <button
                  disabled={
                    r.alreadyTrackedWarehouseId !== null || track.isPending
                  }
                  onClick={() => track.mutate(r)}
                  className="mt-2 rounded-md border border-brand/40 px-3 py-1 font-mono text-xs text-brand disabled:opacity-50"
                >
                  {r.alreadyTrackedWarehouseId ? 'Tracked' : 'Track'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold">
          Tracked warehouses
        </h2>
        {tracked.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing tracked yet — search by ZIP above. Tracked warehouses power
            per-warehouse stock checks and alerts.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tracked.map((w) => (
              <li
                key={w.id}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {w.address ?? ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {w.itemCount} checked
                  </span>
                </div>
                <button
                  onClick={() => untrack.mutate(w.id)}
                  className="mt-2 font-mono text-xs text-muted-foreground hover:text-destructive"
                >
                  untrack
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
