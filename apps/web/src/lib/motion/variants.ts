import type { Variants } from 'motion/react'

/** Expo-out easing — the "premium" curve shared across all reveals. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const DURATION = 0.6

/** Parent that staggers its children into view. Pair with `fadeUpItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/**
 * A single item revealed with a fade + rise.
 * Pass `reduce` (from useReducedMotion) to collapse to opacity-only.
 */
export function fadeUpItem(reduce: boolean, y = 20): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.01 : 0.5, ease: EASE },
    },
  }
}
