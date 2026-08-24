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

/**
 * Tumbles in from above and springs into place — a playful entrance for
 * scattered/sticker-style items (e.g. the About interests). `spin` is the
 * starting rotation (deg) it falls out of before settling to 0 — vary it
 * per item so a group doesn't fall in lockstep. Pass `reduce` (from
 * useReducedMotion) to collapse to a plain fade.
 */
export function fallItem(reduce: boolean, spin = 20): Variants {
  return {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: -120, rotate: spin, scale: 0.85 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: reduce
        ? { duration: 0.01 }
        : { type: 'spring', stiffness: 260, damping: 14, mass: 0.9 },
    },
  }
}
