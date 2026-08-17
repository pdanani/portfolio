import type { ReactNode } from 'react'

/** Small mono pill for tech tags — shared by the experience timeline,
    project cards, and the skills grid. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-xs text-muted-foreground">
      {children}
    </span>
  )
}
