import type { Availability, InventoryRow } from '#/server/costco/types'

const availabilityStyle: Record<Availability, string> = {
  in_stock: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  low_stock: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  out_of_stock: 'bg-red-500/15 text-red-300 border-red-400/30',
  unknown: 'bg-muted text-muted-foreground border-border',
}
const availabilityLabel: Record<Availability, string> = {
  in_stock: 'In stock',
  low_stock: 'Low',
  out_of_stock: 'Out',
  unknown: '—',
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium ${availabilityStyle[availability]}`}
    >
      {availabilityLabel[availability]}
    </span>
  )
}

export function StockText({ status }: { status: string }) {
  if (status === 'not_sold')
    return <span className="font-mono text-[11px] text-muted-foreground">not sold here</span>
  return <AvailabilityBadge availability={status as Availability} />
}

export function DealBadge({ row }: { row: InventoryRow }) {
  if (!row.deal) return null
  const label =
    row.deal.shortText ??
    (row.deal.discountCents > 0 ? `$${(row.deal.discountCents / 100).toFixed(0)} OFF` : 'Deal')
  return (
    <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 font-mono text-[11px] font-bold text-primary-foreground">
      {label}
    </span>
  )
}
