import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { centsToDollars, costcoApi } from '#/lib/costco/api'
import { AvailabilityBadge, DealBadge, StockText } from './badges'

import type { InventoryRow, WatchScope } from '#/server/costco/types'

export function ItemDrawer({ row, onClose }: { row: InventoryRow | null; onClose: () => void }) {
  const queryClient = useQueryClient()

  const price = useMutation({ mutationFn: (id: number) => costcoApi.priceItem(id) })
  const stock = useMutation({ mutationFn: (id: number) => costcoApi.checkStock(id) })
  const scan = useMutation({ mutationFn: (id: number) => costcoApi.scanRegion(id) })

  const watchesQuery = useQuery({ queryKey: ['costco', 'watches'], queryFn: costcoApi.watches })
  const myWatches = (watchesQuery.data?.watches ?? []).filter((w) => w.itemId === row?.itemId)
  const watchFor = (scope: WatchScope) => myWatches.find((w) => w.scope === scope)
  const toggleWatch = useMutation({
    mutationFn: async (scope: WatchScope) => {
      const existing = watchFor(scope)
      if (existing) return costcoApi.removeWatch(existing.id)
      if (row) return costcoApi.addWatch(row.itemId, scope)
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['costco', 'watches'] }),
  })

  // Lazy-price on open; clear stale results when switching items.
  useEffect(() => {
    stock.reset()
    scan.reset()
    if (row) price.mutate(row.itemId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.itemId])

  if (!row) return null
  const live = price.data?.row
  const priceCents = live?.priceCents ?? row.priceCents
  const onlineCents = live?.onlinePriceCents ?? row.onlinePriceCents
  const discountCents = live?.discountCents ?? row.discountCents
  const deal = live?.deal ?? row.deal
  const availability = live?.onlineAvailability ?? row.onlineAvailability

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l border-border bg-popover p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          esc ✕
        </button>

        <div className="flex gap-4">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt="" className="h-24 w-24 rounded-lg bg-white object-contain" />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-muted" />
          )}
          <div className="min-w-0">
            <h2 className="font-display text-lg leading-snug font-semibold text-balance">
              {row.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {row.brand && <span>{row.brand} · </span>}
              {row.costcoItemNumber && <span>Item #{row.costcoItemNumber}</span>}
              {row.model && <span> · Model {row.model}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          {price.isPending && priceCents == null ? (
            <span className="text-sm text-muted-foreground">Fetching price…</span>
          ) : (
            <>
              <span className="font-mono text-2xl font-bold">{centsToDollars(priceCents)}</span>
              {discountCents > 0 && onlineCents != null && onlineCents !== priceCents && (
                <span className="font-mono text-sm text-muted-foreground line-through">
                  {centsToDollars(onlineCents)}
                </span>
              )}
              <DealBadge row={{ ...row, deal }} />
              <AvailabilityBadge availability={availability} />
            </>
          )}
        </div>
        {deal?.longText && (
          <p className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
            {deal.longText}
          </p>
        )}

        <section className="border-t border-border pt-4">
          <h3 className="mb-2 font-display text-sm font-semibold">Alert me when back in stock</h3>
          <div className="flex gap-2">
            {(['online', 'warehouses'] as const).map((scope) => {
              const on = !!watchFor(scope)
              return (
                <button
                  key={scope}
                  onClick={() => toggleWatch.mutate(scope)}
                  disabled={toggleWatch.isPending}
                  className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                    on
                      ? 'border-brand/50 bg-brand/15 text-brand'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {on ? '🔔 ' : ''}
                  {scope === 'online' ? 'Back online' : 'In my warehouses'}
                </button>
              )
            })}
          </div>
        </section>

        <section className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold">Warehouse stock</h3>
            <div className="flex gap-2">
              <button
                onClick={() => stock.mutate(row.itemId)}
                disabled={stock.isPending}
                className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {stock.isPending ? 'checking…' : 'My warehouses'}
              </button>
              <button
                onClick={() => scan.mutate(row.itemId)}
                disabled={scan.isPending}
                className="rounded-md border border-brand/40 px-3 py-1 font-mono text-xs text-brand disabled:opacity-50"
              >
                {scan.isPending ? 'scanning…' : 'Scan Northeast'}
              </button>
            </div>
          </div>

          {stock.isSuccess && stock.data.status === 'no_warehouses' && (
            <p className="text-sm text-muted-foreground">
              Track a warehouse first (Warehouses tab).
            </p>
          )}
          {stock.isSuccess && stock.data.status !== 'no_warehouses' && (
            <ul className="flex flex-col gap-1.5">
              {stock.data.hits.map((h, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span>{h.warehouseName}</span>
                  <StockText status={h.stockStatus} />
                </li>
              ))}
            </ul>
          )}

          {scan.isSuccess && (
            <div className="mt-3">
              <p className="mb-1.5 text-sm font-medium">
                {scan.data.region}: in stock at {scan.data.inStockCount} of {scan.data.scanned}{' '}
                warehouses
              </p>
              <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
                {scan.data.hits
                  .filter((h) => h.stockStatus === 'in_stock' || h.stockStatus === 'low_stock')
                  .map((h, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span>{h.warehouseName}</span>
                      <StockText status={h.stockStatus} />
                    </li>
                  ))}
              </ul>
              {scan.data.inStockCount === 0 && (
                <p className="text-sm text-muted-foreground">
                  Not in stock anywhere in the region right now.
                </p>
              )}
            </div>
          )}
        </section>

        <p className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
          Stock reads Costco's own per-warehouse inventory; prices may lag the shelf.
        </p>
      </aside>
    </div>
  )
}
