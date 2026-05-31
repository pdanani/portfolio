import { useScroll, useSpring } from 'motion/react'

/**
 * Smoothed 0→1 page scroll progress, for a top progress bar or scroll-linked
 * effects. Returns a MotionValue; bind to `style={{ scaleX }}` on an `m` element.
 */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
}
