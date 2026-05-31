import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

const STACK = ['Spring Boot', 'Postgres', 'Redis', 'Kafka', 'Docker', 'gRPC']

export function BentoHero() {
  const reduce = useReducedMotion()
  const card = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: reduce ? 0.01 : 0.55, ease: EASE, delay: reduce ? 0 : i * 0.09 },
  })
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-16 font-sans">
      <div className="bento-grid">
        <m.section {...card(0)} className="surface bento-name flex flex-col justify-between p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            <span className="bento-dot mr-2 align-middle" /> Software engineer
          </p>
          <div className="mt-6">
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">Pawan Danani</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Building resilient, distributed systems the way that sticks — hands-on lab
              projects pairing Spring Boot with Postgres, Redis, and Kafka.
            </p>
          </div>
        </m.section>

        <m.section {...card(1)} className="surface bento-status flex flex-col justify-between p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Status</p>
          <p className="mt-3 font-display text-lg font-medium leading-snug">
            <span className="text-primary">Open</span> to backend &amp; platform roles
          </p>
        </m.section>

        <m.section {...card(2)} className="surface bento-stack flex flex-col p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STACK.map((t) => (
              <li
                key={t}
                className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </m.section>

        <m.section {...card(3)} className="surface bento-building flex flex-col justify-between p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Currently building</p>
          <p className="mt-3 text-sm leading-relaxed text-card-foreground">
            A Kafka-backed event pipeline with idempotent consumers and Redis-cached
            read models — written up and deployable end to end.
          </p>
        </m.section>

        <m.section {...card(4)} className="surface bento-projects flex flex-col justify-between gap-4 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Lab projects</p>
          <div className="flex flex-col gap-2.5">
            <a
              href="#"
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              View projects
            </a>
            <a
              href="#"
              className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-accent"
            >
              About
            </a>
          </div>
        </m.section>
      </div>
    </main>
  )
}
