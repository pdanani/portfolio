import { createFileRoute } from '@tanstack/react-router'
import { m, useReducedMotion } from 'motion/react'
import { Reveal } from '#/components/motion/reveal'
import { StaggerGroup, StaggerItem } from '#/components/motion/stagger'
import { EASE } from '#/lib/motion/variants'

export const Route = createFileRoute('/')({ component: Home })

// Placeholder content — real data is wired in a later phase (port of data.json).
const highlights = [
  {
    title: 'Distributed Systems Labs',
    body: 'Hands-on Spring Boot 4 services — Postgres, Redis, Kafka — each with a writeup and a live demo.',
  },
  {
    title: 'Production Engineering',
    body: 'POS systems, payments, and AWS pipelines shipped at scale across React and Node.',
  },
  {
    title: 'Built to be fast',
    body: 'TanStack Start, edge-rendered, with motion that respects your reduced-motion settings.',
  },
]

function Home() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="flex min-h-[88vh] flex-col justify-center">
        <m.p
          {...rise(0)}
          className="font-mono text-sm uppercase tracking-[0.2em] text-brand-cyan"
        >
          // software engineer
        </m.p>
        <m.h1
          {...rise(0.08)}
          className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Pawan Danani
          <span className="block bg-gradient-to-r from-brand via-brand-cyan to-brand bg-clip-text text-transparent">
            builds resilient systems.
          </span>
        </m.h1>
        <m.p
          {...rise(0.16)}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Full-stack engineer shipping production software and exploring
          distributed systems through hands-on lab projects.
        </m.p>
        <m.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-3">
          <a
            href="#work"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            View projects
          </a>
          <a
            href="#work"
            className="rounded-lg border border-border px-5 py-2.5 font-medium transition hover:bg-accent"
          >
            About me
          </a>
        </m.div>
      </section>

      {/* Scroll-revealed section (demonstrates Reveal + Stagger) */}
      <section id="work" className="border-t border-border py-24">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand-cyan">
            // what i do
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            A portfolio that doubles as a systems playground.
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {highlights.map((h) => (
            <StaggerItem
              key={h.title}
              className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-brand/50"
            >
              <h3 className="font-display text-xl font-semibold">{h.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{h.body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-t border-border py-24">
        <Reveal y={32}>
          <p className="text-center text-muted-foreground">
            More coming soon — projects, experience, and live distributed-systems
            demos.
          </p>
        </Reveal>
      </section>
    </main>
  )
}
