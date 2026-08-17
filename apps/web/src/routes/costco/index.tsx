import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { centsToDollars, costcoApi } from '#/lib/costco/api'
import { AvailabilityBadge, DealBadge } from '#/components/costco/badges'
import { ItemDrawer } from '#/components/costco/item-drawer'

import type { InventoryRow, InventorySort } from '#/server/costco/types'

export const Route = createFileRoute('/costco/')({ component: InventoryPage })

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

const sorts: Array<{ value: InventorySort; label: string }> = [
  { value: 'name', label: 'Name' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'biggest_savings', label: 'Savings' },
  { value: 'newest', label: 'Newest' },
]

function InventoryPage() {
  const [search, setSearch] = useState('')
  const q = useDebounced(search, 350)
  const [sort, setSort] = useState<InventorySort>('name')
  const [dealsOnly, setDealsOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<InventoryRow | null>(null)
  const [lookupText, setLookupText] = useState('')

  const inventory = useQuery({
    queryKey: ['costco', 'inventory', { q, sort, dealsOnly, page }],
    queryFn: () => costcoApi.inventory({ q: q || undefined, sort, dealsOnly, page }),
    placeholderData: keepPreviousData,
  })

  const lookup = useMutation({
    mutationFn: async (query: string) => {
      const { itemId } = await costcoApi.lookup(query)
      const { row } = await costcoApi.getItem(itemId)
      return row
    },
    onSuccess: (row) => {
      setSelected(row)
      setLookupText('')
    },
  })

  const data = inventory.data
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (lookupText.trim()) lookup.mutate(lookupText.trim())
        }}
        className="flex gap-2"
      >
        <input
          value={lookupText}
          onChange={(e) => setLookupText(e.target.value)}
          placeholder="Paste a Costco URL or item # for an exact item (works even when search can't find it)"
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={!lookupText.trim() || lookup.isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {lookup.isPending ? 'Looking…' : 'Look up'}
        </button>
      </form>
      {lookup.isError && (
        <p className="text-sm text-destructive">{(lookup.error as Error).message}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search Costco's full catalog…"
          className="min-w-52 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex rounded-md border border-border p-0.5">
          {sorts.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setSort(s.value)
                setPage(1)
              }}
              className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                sort === s.value
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={dealsOnly}
            onChange={(e) => {
              setDealsOnly(e.target.checked)
              setPage(1)
            }}
            className="accent-[var(--brand)]"
          />
          deals only
        </label>
      </div>

      {inventory.isLoading ? (
        <p className="py-12 text-center text-muted-foreground">Loading…</p>
      ) : inventory.isError ? (
        <p className="py-12 text-center text-destructive">
          {(inventory.error as Error).message}
        </p>
      ) : data && data.rows.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-medium">Search any Costco product to get started</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Search hits Costco's live catalog — try “seiko”, “kirkland”, “olipop”.
          </p>
        </div>
      ) : data ? (
        <>
          <p className="font-mono text-xs text-muted-foreground">
            {data.total.toLocaleString()} items
          </p>
          <ul className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
            {data.rows.map((row) => (
              <li key={row.itemId}>
                <button
                  onClick={() => setSelected(row)}
                  className="flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary/40"
                >
                  {row.imageUrl ? (
                    <img
                      src={row.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-md bg-white object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-md bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {row.brand ?? row.category ?? ''}
                    </p>
                  </div>
                  <DealBadge row={row} />
                  <div className="w-20 text-right">
                    <p className="font-mono text-sm font-semibold">
                      {centsToDollars(row.priceCents)}
                    </p>
                    {row.discountCents > 0 &&
                      row.onlinePriceCents != null &&
                      row.onlinePriceCents !== row.priceCents && (
                        <p className="font-mono text-xs text-muted-foreground line-through">
                          {centsToDollars(row.onlinePriceCents)}
                        </p>
                      )}
                  </div>
                  <div className="hidden w-20 justify-end sm:flex">
                    <AvailabilityBadge availability={row.onlineAvailability} />
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 font-mono text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-border px-3 py-1 disabled:opacity-40"
              >
                ← prev
              </button>
              <span className="text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-border px-3 py-1 disabled:opacity-40"
              >
                next →
              </button>
            </div>
          )}
        </>
      ) : null}

      <ItemDrawer row={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
