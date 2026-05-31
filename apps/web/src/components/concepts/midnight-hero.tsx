import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Midnight — refined neon HUD: corner brackets, scanlines, azure glow headline. */
export function MidnightHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const corners = [
    'left-6 top-6 border-l border-t',
    'right-6 top-6 border-r border-t',
    'bottom-6 left-6 border-b border-l',
    'bottom-6 right-6 border-b border-r',
  ]

  return (
    <main className="midnight-scanlines relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="midnight-grid pointer-events-none absolute inset-x-0 bottom-0 h-2/5" />

      {corners.map((pos) => (
        <m.span
          key={pos}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.01 : 0.8, ease: EASE, delay: 0.1 }}
          className={`pointer-events-none absolute size-12 border-primary/70 ${pos}`}
        />
      ))}

      <div className="relative max-w-3xl text-center">
        <m.p
          {...rise(0)}
          className="font-mono text-xs uppercase tracking-[0.4em] text-brand-cyan"
        >
          sys · engineer — node online
        </m.p>
        <m.h1
          {...rise(0.08)}
          className="midnight-neon mt-6 font-display text-6xl font-semibold tracking-tight sm:text-8xl"
        >
          Pawan Danani
        </m.h1>
        <m.p
          {...rise(0.16)}
          className="mx-auto mt-6 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          // building resilient distributed systems through hands-on lab work —
          Spring Boot, Postgres, Redis &amp; Kafka.
        </m.p>
        <m.div {...rise(0.26)} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="rounded-md bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wide text-primary-foreground transition hover:opacity-90"
            style={{ boxShadow: '0 0 28px color-mix(in oklab, var(--primary) 55%, transparent)' }}
          >
            View projects
          </a>
          <a
            href="#"
            className="rounded-md border border-primary/60 px-6 py-3 font-mono text-sm uppercase tracking-wide text-primary transition hover:bg-accent"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
