import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { m, useScroll, useTransform } from 'motion/react'

/* Light shafts from where the sun went down — the hero sets it at x ≈ 0.78,
   so the fan is anchored there and leans left as it reaches down. Each is a
   tall bar rotated about its top; `x`/`w` are vw, `a` degrees, `i` peak
   opacity, `d` the sway period (s), `delay` a negative offset so the five
   never sway in lockstep. Values feed the CSS custom properties that
   `.undersea-ray` reads. */
const RAYS = [
  { x: 63, w: 5, a: 2, i: 0.07, d: 12.5, delay: -9 },
  { x: 71, w: 7, a: 8, i: 0.11, d: 11, delay: 0 },
  { x: 77, w: 12, a: 15, i: 0.15, d: 14, delay: -4 },
  { x: 85, w: 8, a: 22, i: 0.1, d: 9.5, delay: -2 },
  { x: 91, w: 14, a: 30, i: 0.12, d: 16, delay: -7 },
]

/**
 * Everything below the hero's waterline is under the sea. Wraps the page
 * sections in a scene that deepens as the reader scrolls: sunlit shallows
 * (the set sun's rays still reach here) cross-fade into abyssal dark, marine
 * snow drifts up throughout, and bioluminescent glow wakes at depth.
 *
 * The backdrop is one viewport-sized `position: sticky` layer at the top of
 * the container — it rides along for the whole descent, takes no space
 * (negative bottom margin), and, unlike a `fixed` layer, can never paint over
 * the hero above. Depth is the container's scroll progress: 0 when its top
 * reaches the top of the viewport, 1 when its bottom reaches the bottom.
 * Only opacity/transform are ever animated, so it all stays on the
 * compositor; the CSS keyframes are neutralised by the global
 * reduced-motion rule in styles.css.
 */
export function Undersea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: depth } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Every range spans the full [0, 1] with a flat tail on purpose. Motion can
  // hand these to the browser as native scroll-driven animations, building
  // WAAPI keyframes from the input range — and WAAPI fills a missing
  // offset-1 keyframe with the element's base value, so `[0, 0.9]` would
  // slide back to opacity 0 over the last 10% instead of holding.
  const deep = useTransform(depth, [0, 0.9, 1], [0, 1, 1])
  const raysOpacity = useTransform(depth, [0, 0.55, 1], [1, 0, 0])
  const raysY = useTransform(depth, [0, 0.55, 1], ['0%', '-30%', '-30%'])
  const glow = useTransform(depth, [0, 0.4, 1], [0, 0, 1])

  return (
    <div ref={ref} className="undersea">
      <div aria-hidden className="undersea-backdrop">
        <div className="undersea-shallow" />
        <m.div className="undersea-deep" style={{ opacity: deep }} />

        <m.div
          className="undersea-rays"
          style={{ opacity: raysOpacity, y: raysY }}
        >
          {RAYS.map((ray) => (
            <div
              key={ray.x}
              className="undersea-ray"
              style={
                {
                  '--x': `${ray.x}vw`,
                  '--w': `${ray.w}vw`,
                  '--a': `${ray.a}deg`,
                  '--i': ray.i,
                  '--d': `${ray.d}s`,
                  '--delay': `${ray.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </m.div>

        <div className="undersea-snow undersea-snow-far" />
        <div className="undersea-snow undersea-snow-near" />

        <m.div className="undersea-glow-depth" style={{ opacity: glow }}>
          <div className="undersea-glow" />
        </m.div>
      </div>

      {/* in-flow (not sticky) so it scrolls away with the seam: eases the
          hero's dark scrim into the lit shallows instead of a hard edge */}
      <div aria-hidden className="undersea-surface" />

      {children}
    </div>
  )
}
