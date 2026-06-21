import { useState } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** A few brighter foreground stars that gently twinkle (CSS-animated). */
const TWINKLE = [
  { k: 't1', top: '18%', left: '22%', size: 3, delay: '0s' },
  { k: 't2', top: '30%', left: '68%', size: 2, delay: '1.4s' },
  { k: 't3', top: '62%', left: '14%', size: 2.5, delay: '0.7s' },
  { k: 't4', top: '74%', left: '54%', size: 2, delay: '2.1s' },
  { k: 't5', top: '12%', left: '82%', size: 2.5, delay: '3s' },
  { k: 't6', top: '46%', left: '40%', size: 2, delay: '1.9s' },
] as const

/** Faint tick marks along the orbital HUD arc. */
const HUD_TICKS = [12, 38, 64, 90, 116, 142, 168] as const

export function SpaceHero() {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  // Slow linear spin helper — frozen flat when reduced motion is requested.
  const spin = (duration: number, from = 0) =>
    reduce
      ? { animate: { rotate: from } }
      : {
          animate: { rotate: from + 360 },
          transition: { duration, ease: 'linear' as const, repeat: Infinity },
        }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      {/* ---------------- Cosmos (behind content) ---------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base vertical depth gradient */}
        <div className="space-void" />

        {/* drifting nebula blobs */}
        <div className={`space-nebula space-nebula--a${reduce ? ' space-paused' : ''}`} />
        <div className={`space-nebula space-nebula--b${reduce ? ' space-paused' : ''}`} />
        <div className={`space-nebula space-nebula--c${reduce ? ' space-paused' : ''}`} />

        {/* parallax starfields (three layers, different speeds) */}
        <div className={`space-stars space-stars--far${reduce ? ' space-paused' : ''}`} />
        <div className={`space-stars space-stars--mid${reduce ? ' space-paused' : ''}`} />
        <div className={`space-stars space-stars--near${reduce ? ' space-paused' : ''}`} />

        {/* brighter twinkling stars */}
        {TWINKLE.map((s) => (
          <span
            key={s.k}
            className={`space-twinkle${reduce ? ' space-paused' : ''}`}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}

        {/* occasional slow shooting star */}
        <span className={`space-shoot${reduce ? ' space-paused' : ''}`} />

        {/* ---- the planet system ---- */}
        <div className="space-system">
          {/* faint orbital HUD arc */}
          <svg className="space-hud" viewBox="0 0 360 360" fill="none" aria-hidden>
            <circle cx="180" cy="180" r="176" className="space-hud-ring" />
            {HUD_TICKS.map((deg) => (
              <line
                key={`tick-${deg}`}
                x1="180"
                y1="6"
                x2="180"
                y2="16"
                className="space-hud-tick"
                transform={`rotate(${deg} 180 180)`}
              />
            ))}
          </svg>

          {/* tilted orbit ring + orbiting moon (slow Motion rotation) */}
          <m.div className="space-orbit" {...spin(reduce ? 0 : 64)}>
            <div className="space-ring" />
            <div className="space-moon-track">
              <span className="space-moon" />
            </div>
          </m.div>

          {/* the gas giant */}
          <div className="space-planet">
            {/* slowly rotating banded surface */}
            <m.div className="space-bands" {...spin(reduce ? 0 : 180)} />
            {/* fixed soft day/night terminator + shading */}
            <div className="space-terminator" />
            {/* thin atmospheric rim light */}
            <div className="space-rim" />
            {/* inner contact glow toward the star */}
            <div className="space-planet-glow" />
          </div>

          {/* distant star glow that lights the scene */}
          <div className="space-sun" />
        </div>

        {/* vignette to seat the text */}
        <div className="space-vignette" />
      </div>

      {/* ---------------- Overlay content ---------------- */}
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        <m.p
          {...rise(0.1)}
          className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.34em] text-brand-cyan sm:text-xs"
        >
          <span className="space-eyebrow-dot" />
          Backend Engineer · Distributed Systems
        </m.p>

        <m.h1
          {...rise(0.2)}
          className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl"
        >
          Pawan Danani
        </m.h1>

        <m.p
          {...rise(0.32)}
          className="mt-7 max-w-xl font-sans text-base leading-relaxed text-foreground/85 sm:text-lg"
        >
          I build resilient, distributed systems engineered to stay calm under load —
          <span className="text-brand-amber"> Spring Boot</span> services backed by
          <span className="text-foreground"> Postgres</span>,
          <span className="text-foreground"> Redis</span>, and
          <span className="text-foreground"> Kafka</span>, designed to fail gracefully and
          recover on their own.
        </m.p>

        <m.div {...rise(0.44)} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="space-cta space-cta--primary font-mono text-[12px] uppercase tracking-[0.18em] sm:text-sm"
          >
            <span className="relative z-10">View projects</span>
            <span aria-hidden className={`space-cta-arrow${hover ? ' space-cta-arrow--on' : ''}`}>
              →
            </span>
          </a>
          <a
            href="#"
            className="space-cta space-cta--ghost font-mono text-[12px] uppercase tracking-[0.18em] sm:text-sm"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
