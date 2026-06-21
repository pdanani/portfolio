import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Floating Mart — a tiny lit convenience store on a dock over calm dusk water.
 * Warm windows + a red-LED "CONVENIENCE" sign glow against the blue hour, and a
 * vertically mirrored copy of the store ripples in the water below via an inline
 * SVG feTurbulence/feDisplacementMap filter whose baseFrequency is driven by an
 * rAF loop (frozen to a calm static frame under reduced motion).
 */
export function ConvenienceHero() {
  const reduce = useReducedMotion()
  const turbRef = useRef<SVGFETurbulenceElement | null>(null)

  // Wobble the water by sweeping the turbulence baseFrequency over time. We keep
  // the X frequency tiny (long horizontal swells) and breathe the Y frequency.
  useEffect(() => {
    if (reduce) return
    const node = turbRef.current
    if (!node) return
    let raf = 0
    let start = 0
    const loop = (t: number) => {
      if (!start) start = t
      const s = (t - start) / 1000
      const fy = 0.026 + Math.sin(s * 0.9) * 0.012
      const fx = 0.0085 + Math.sin(s * 0.6 + 1.2) * 0.003
      node.setAttribute('baseFrequency', `${fx.toFixed(4)} ${fy.toFixed(4)}`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  const stars = [
    { k: 's1', top: '11%', left: '17%', s: 2, d: 0 },
    { k: 's2', top: '8%', left: '38%', s: 1.5, d: 1.1 },
    { k: 's3', top: '15%', left: '63%', s: 2, d: 0.6 },
    { k: 's4', top: '7%', left: '78%', s: 1.5, d: 1.8 },
    { k: 's5', top: '19%', left: '86%', s: 2, d: 0.3 },
    { k: 's6', top: '13%', left: '8%', s: 1.5, d: 2.2 },
    { k: 's7', top: '21%', left: '49%', s: 1.5, d: 1.5 },
    { k: 's8', top: '10%', left: '28%', s: 1, d: 0.9 },
  ]

  // The store artwork is rendered once, then re-used (mirrored + filtered) as the
  // water reflection. Keeping it in a fragment avoids duplicating the markup twice.
  const store = (
    <div className="convenience-store">
      <div className="convenience-sign">
        <span className="convenience-sign-text">CONVENIENCE</span>
        <span className="convenience-open">OPEN</span>
      </div>
      <div className="convenience-roof" />
      <div className="convenience-body">
        <div className="convenience-window convenience-window--l">
          <span className="convenience-shelf" />
          <span className="convenience-shelf" />
        </div>
        <div className="convenience-door">
          <span className="convenience-door-glow" />
        </div>
        <div className="convenience-window convenience-window--r">
          <span className="convenience-shelf" />
          <span className="convenience-shelf" />
        </div>
        <span className="convenience-crate convenience-crate--a" />
        <span className="convenience-crate convenience-crate--b" />
        <span className="convenience-flowers" />
      </div>
      <div className="convenience-dock" />
      <div className="convenience-piling convenience-piling--l" />
      <div className="convenience-piling convenience-piling--r" />
    </div>
  )

  return (
    <main className="convenience-root relative isolate min-h-screen overflow-hidden">
      {/* Inline SVG filter that distorts the reflection. Zero-size, no paint. */}
      <svg
        aria-hidden
        className="convenience-defs"
        width="0"
        height="0"
        focusable="false"
      >
        <filter id="convenience-ripple" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.0085 0.026"
            numOctaves={2}
            seed={7}
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={reduce ? 4 : 16}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="convenience-sky" />
        <div className="convenience-glow-sky" />
        <div className="convenience-shore" />
        {stars.map((st) => (
          <span
            key={st.k}
            className={`convenience-star${reduce ? ' convenience-star--still' : ''}`}
            style={{
              top: st.top,
              left: st.left,
              width: st.s,
              height: st.s,
              animationDelay: `${st.d}s`,
            }}
          />
        ))}

        {/* Stage holds the upright store and, below the waterline, its ripple. */}
        <div className="convenience-stage">
          <div className="convenience-scene">{store}</div>
          <div className="convenience-waterline" />
          <div className="convenience-reflection" aria-hidden>
            <div className="convenience-reflection-inner">{store}</div>
          </div>
          <span className="convenience-shimmer convenience-shimmer--1" />
          <span className="convenience-shimmer convenience-shimmer--2" />
          <span className="convenience-shimmer convenience-shimmer--3" />
        </div>
        <div className="convenience-water-tint" />
      </div>

      {/* Overlay content */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <div className="max-w-xl">
          <m.p {...rise(0.05)} className="convenience-eyebrow font-mono text-[0.7rem] uppercase tracking-[0.4em]">
            <span className="convenience-eyebrow-dot" />
            Open 24/7 · Software Engineer
          </m.p>

          <m.h1
            {...rise(0.16)}
            className="convenience-title mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl"
          >
            Pawan
            <br />
            Danani
          </m.h1>

          <m.p
            {...rise(0.28)}
            className="convenience-tagline mt-7 max-w-md font-sans text-base leading-relaxed sm:text-lg"
          >
            Open late, always stocked — building resilient distributed systems with
            Spring Boot, Postgres, Redis &amp; Kafka, lit up and ready to serve.
          </m.p>

          <m.div {...rise(0.4)} className="mt-10 flex flex-wrap gap-4">
            <a href="#" className="convenience-cta convenience-cta--primary font-mono text-xs uppercase tracking-[0.18em]">
              View projects
            </a>
            <a href="#" className="convenience-cta convenience-cta--ghost font-mono text-xs uppercase tracking-[0.18em]">
              About
            </a>
          </m.div>
        </div>
      </div>
    </main>
  )
}
