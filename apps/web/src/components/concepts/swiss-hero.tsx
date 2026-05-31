import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Swiss — International Typographic Style: rigorous grid, flush-left grotesk, one decisive red accent. */
const meta = [
  ['01', 'Role', 'Software Engineer'],
  ['02', 'Location', 'Remote / Worldwide'],
  ['03', 'Index', 'Distributed Systems'],
]

export function SwissHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 sm:px-10">
      <m.div
        {...rise(0)}
        className="flex items-baseline justify-between border-t-2 border-foreground pt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span>Portfolio — MMXXVI</span>
        <span className="text-brand">●</span>
      </m.div>

      <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <m.p
            {...rise(0.06)}
            className="font-mono text-sm uppercase tracking-[0.22em] text-brand"
          >
            Software Engineer
          </m.p>
          <m.h1
            {...rise(0.12)}
            className="mt-5 font-display text-[clamp(3rem,11vw,8.5rem)] font-extrabold leading-[0.88] tracking-tight"
          >
            Pawan
            <br />
            Danani
          </m.h1>
        </div>

        <m.aside {...rise(0.2)} className="col-span-12 self-end lg:col-span-4">
          <ul className="space-y-px border-t border-border">
            {meta.map(([num, label, value]) => (
              <li
                key={num}
                className="grid grid-cols-[2rem_1fr] items-baseline gap-3 border-b border-border py-3 font-mono text-sm"
              >
                <span className="text-brand">{num}</span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-foreground">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </m.aside>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 border-t-2 border-foreground pt-8">
        <m.p
          {...rise(0.28)}
          className="col-span-12 max-w-xl font-sans text-lg leading-relaxed text-foreground lg:col-span-7 lg:col-start-1"
        >
          Building resilient, distributed systems through hands-on lab projects —
          <span className="text-brand"> Spring Boot</span> services backed by Postgres,
          Redis, and Kafka. Each one shipped, documented, and built to fail gracefully.
        </m.p>

        <m.nav
          {...rise(0.36)}
          className="col-span-12 flex items-start gap-4 lg:col-span-5 lg:justify-end"
        >
          <a
            href="#"
            className="bg-foreground px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-background transition hover:bg-brand"
          >
            View projects →
          </a>
          <a
            href="#"
            className="border border-foreground px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-foreground transition hover:bg-accent"
          >
            About
          </a>
        </m.nav>
      </div>
    </main>
  )
}
