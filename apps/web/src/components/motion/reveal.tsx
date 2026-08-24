import { useRef } from 'react'
import type { ReactNode } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { DURATION, EASE } from '#/lib/motion/variants'
import { IN_VIEW } from '#/lib/motion/in-view'

export interface RevealProps {
  children: ReactNode
  className?: string
  /** Travel distance in px (ignored under reduced motion). */
  y?: number
  delay?: number
  /** Reveal only once (default) vs every time it scrolls into view. */
  once?: boolean
}

/**
 * Fade + rise as the element scrolls into view. Driven by `useInView` (a
 * standalone IntersectionObserver hook) so it never silently leaves content
 * hidden. Collapses to an instant opacity swap under reduced motion.
 */
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once, ...IN_VIEW })

  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : y }
      }
      transition={{ duration: reduce ? 0.01 : DURATION, ease: EASE, delay }}
    >
      {children}
    </m.div>
  )
}
