import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Star Wars — original space-opera homage: gold opening crawl over a starfield. */
const stack = ['Spring Boot', 'Postgres', 'Redis', 'Kafka'] as const

const crawl = [
  'Across a galaxy of restless servers, a lone engineer keeps the lights on.',
  'Pawan Danani builds resilient distributed systems that refuse to fall — fault-tolerant services, self-healing pipelines, and data that survives the dark.',
  'When traffic surges like a passing fleet, the systems hold. When a node goes dim, another takes the watch.',
] as const

export function StarWarsHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* Deep-space scenery: void + layered starfield + horizon planet (behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="starwars-space" />
        <div className="starwars-stars" />
        <div className="starwars-stars starwars-stars--far" />
        <div className="starwars-stars starwars-stars--bright" />
        <div className="starwars-planet" />
      </div>

      {/* Receding gold opening crawl, filling the lower viewport (rests readable) */}
      <div aria-hidden className="starwars-stage -z-10">
        <div className="starwars-crawl">
          <p className="starwars-crawl-eyebrow font-display text-[11px] font-semibold sm:text-sm">
            A long uptime ago, in a datacenter far, far away…
          </p>
          <div className="mt-6 space-y-5">
            {crawl.map((line, i) => (
              <p
                key={`crawl-${i}`}
                className="font-display text-base font-semibold leading-relaxed sm:text-2xl"
              >
                {line}
              </p>
            ))}
            <p className="font-display text-sm font-semibold leading-relaxed sm:text-xl">
              The stack of the resistance: {stack.join(' · ')}.
            </p>
          </div>
        </div>
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 pt-8 text-foreground"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="starwars-pip" />
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/80 sm:text-xs">
            Sector 7 · Systems Command
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan sm:inline">
          uptime 99.99%
        </span>
      </m.div>

      {/* Centered content sitting above the crawl */}
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col justify-center px-6">
        <m.p
          {...rise(0.08)}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-cyan sm:text-xs"
        >
          Episode IV · Software Engineer
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="starwars-title mt-6 font-display text-5xl font-extrabold leading-[0.92] tracking-tight sm:text-8xl"
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

        <m.div
          {...rise(0.44)}
          className="mt-10 flex flex-wrap items-center gap-5 font-display text-xs font-semibold uppercase tracking-[0.16em]"
        >
          <a
            href="#"
            className="starwars-saber bg-card px-7 py-3.5 text-brand-cyan"
          >
            <span aria-hidden className="starwars-pip" />
            View projects
          </a>
          <a
            href="#"
            className="starwars-saber starwars-saber--gold px-7 py-3.5 text-primary"
          >
            Contact
          </a>
        </m.div>
      </div>
    </main>
  )
}
