import { useRef } from 'react'
import type { ReactNode } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { fadeUpItem, staggerContainer } from '#/lib/motion/variants'

export interface StaggerGroupProps {
  children: ReactNode
  className?: string
  amount?: number
  once?: boolean
}

/**
 * Reveals its `<StaggerItem>` children in sequence once scrolled into view.
 * Use for grids/lists (e.g. project cards).
 */
export function StaggerGroup({
  children,
  className,
  amount = 0.2,
  once = true,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })

  return (
    <m.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </m.div>
  )
}

export interface StaggerItemProps {
  children: ReactNode
  className?: string
  y?: number
}

/** A single child of `<StaggerGroup>`; its reveal is orchestrated by the group. */
export function StaggerItem({ children, className, y }: StaggerItemProps) {
  const reduce = useReducedMotion()
  return (
    <m.div className={className} variants={fadeUpItem(reduce ?? false, y)}>
      {children}
    </m.div>
  )
}
