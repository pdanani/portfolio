import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Star Wars — in-world starship command console / cockpit HUD (no opening crawl). */
const readouts = [
  { sys: 'SHIELDS', label: 'UPTIME', value: '99.99%' },
  { sys: 'HYPERDRIVE', label: 'LATENCY', value: '12ms' },
  { sys: 'REACTOR', label: 'THROUGHPUT', value: '8.2k rps' },
] as const

export function StarWarsHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="starwars-root relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      {/* Deep-space viewport canopy: void + layered starfield + horizon planet glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="starwars-space" />
        <div className="starwars-stars" />
        <div className="starwars-stars starwars-stars--far" />
        <div className="starwars-stars starwars-stars--bright" />
        <div className="starwars-planet" />
      </div>

      {/* HUD overlay: scanlines + corner brackets + a slow targeting reticle sweep */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="starwars-scanlines" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-4 -z-10 sm:inset-6">
        <span className="starwars-bracket starwars-bracket--tl" />
        <span className="starwars-bracket starwars-bracket--tr" />
        <span className="starwars-bracket starwars-bracket--bl" />
        <span className="starwars-bracket starwars-bracket--br" />
      </div>

      {/* Slowly-rotating wireframe hologram orb (rests visible, motion-safe) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-1/2 -z-10 hidden -translate-y-1/2 lg:block"
      >
        <div className="starwars-holo">
          <span className="starwars-holo-ring" />
          <span className="starwars-holo-ring starwars-holo-ring--b" />
          <span className="starwars-holo-ring starwars-holo-ring--c" />
          <span className="starwars-reticle" />
        </div>
      </div>

      {/* Top STATUS BAR — in-world telemetry */}
      <m.div
        {...rise(0)}
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pt-7 sm:pt-9"
      >
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="starwars-pip" />
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/85 sm:text-xs">
            Sector 7 · Systems Command
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan sm:text-xs">
            Uptime 99.99%
          </span>
          <span aria-hidden className="starwars-status-dot" />
        </div>
      </m.div>

      {/* Centerpiece console content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-6xl flex-col justify-center px-6">
        <m.p
          {...rise(0.08)}
          className="font-mono text-[11px] uppercase tracking-[0.34em] text-brand-cyan sm:text-xs"
        >
          Episode IV · Software Engineer
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="starwars-title mt-5 font-display text-5xl font-extrabold leading-[0.9] tracking-tight sm:text-8xl"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.3)}
          className="mt-7 max-w-xl font-sans text-base leading-relaxed text-foreground/85 sm:text-lg"
        >
          Engineering resilient, distributed systems that hold the line under
          load — fault-tolerant services forged in{' '}
          <span className="text-primary">Spring Boot</span>,{' '}
          <span className="text-primary">Postgres</span>,{' '}
          <span className="text-primary">Redis</span>, and{' '}
          <span className="text-primary">Kafka</span>.
        </m.p>

        {/* Holographic console readouts */}
        <m.div
          {...rise(0.4)}
          className="mt-9 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {readouts.map((r) => (
            <div key={r.sys} className="starwars-panel px-4 py-3">
              <div className="flex items-center gap-2">
                <span aria-hidden className="starwars-panel-pip" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-cyan">
                  {r.sys}
                </span>
              </div>
              <p className="mt-2 font-display text-xl font-bold leading-none text-foreground">
                {r.value}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                {r.label}
              </p>
            </div>
          ))}
        </m.div>

        {/* NAV — glowing console buttons, high contrast */}
        <m.nav
          {...rise(0.52)}
          aria-label="Primary"
          className="mt-10 flex flex-wrap items-center gap-4 font-display text-xs font-semibold uppercase tracking-[0.16em]"
        >
          <a href="#projects" className="starwars-btn starwars-btn--primary">
            <span aria-hidden className="starwars-btn-pip" />
            View Projects
          </a>
          <a href="#about" className="starwars-btn">
            About
          </a>
          <a href="#contact" className="starwars-btn">
            Contact
          </a>
        </m.nav>
      </div>
    </main>
  )
}
