import type { Variants } from 'motion/react'

/** Expo-out easing — the "premium" curve shared across all reveals. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const DURATION = 0.6

/** Parent that staggers its children into view. Pair with `fadeUpItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
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
      : { opacity: 0, y: -80, rotate: spin, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      // A tween, not a spring: springs are integrated per frame on the main
      // thread, so eight of them landed on top of the halo/undersea paint
      // work and dropped frames on iOS. This curve overshoots a little at
      // the end (the y > 1 control point), which keeps the bounce, and
      // Motion can hand a fixed-duration transform tween to the browser.
      transition: reduce
        ? { duration: 0.01 }
        : { duration: 0.45, ease: [0.34, 1.4, 0.64, 1] },
    },
  }
}
