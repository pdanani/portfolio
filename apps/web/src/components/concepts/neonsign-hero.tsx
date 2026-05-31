import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Neon Sign — a realistic glowing neon bar sign (glass tubes + buzz/flicker) on
 * a dark brick wall. Token-driven, so the Neon Green and Neon Red kits both use
 * it: --primary is the main tube color, --brand-cyan the secondary tube.
 */
export function NeonSignHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="neonsign-wall relative isolate grid min-h-screen place-items-center overflow-hidden px-6">
      <div aria-hidden className="neonsign-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="neonsign-floor pointer-events-none absolute inset-x-0 bottom-0" />

      <div className="relative w-full max-w-3xl text-center">
        <m.p
          {...rise(0)}
          className="neonsign-tube-accent font-mono text-[0.7rem] uppercase tracking-[0.45em] sm:text-xs"
        >
          ★ open · software engineer ★
        </m.p>

        <m.h1
          {...rise(0.12)}
          className="neonsign-tube neonsign-flicker mt-7 font-display text-6xl font-bold leading-[0.95] sm:text-8xl"
        >
          Pawan
          <span className="block">Danani</span>
        </m.h1>

        <m.p
          {...rise(0.24)}
          className="mx-auto mt-9 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Building resilient, distributed systems — Spring Boot, Postgres, Redis
          &amp; Kafka.
        </m.p>

        <m.div {...rise(0.34)} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="neonsign-btn px-6 py-3 font-display text-[0.7rem] uppercase tracking-wider"
          >
            View projects
          </a>
          <a
            href="#"
            className="neonsign-btn neonsign-btn-accent px-6 py-3 font-display text-[0.7rem] uppercase tracking-wider"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
