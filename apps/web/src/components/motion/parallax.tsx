import { useRef } from 'react'
import type { ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'

export interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Fraction of the element's travel to offset; higher = more depth. */
  speed?: number
}

/**
 * Scroll-linked vertical parallax. Transform-only (GPU friendly) and fully
 * disabled under reduced motion.
 */
export function Parallax({ children, className, speed = 0.2 }: ParallaxProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </m.div>
  )
}
