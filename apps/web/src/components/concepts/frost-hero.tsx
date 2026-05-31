import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function FrostHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })
  const stack = ['Spring Boot', 'Postgres', 'Redis', 'Kafka']
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-20">
      <m.section
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE }}
        className="surface frost-card relative w-full max-w-3xl overflow-hidden px-8 py-14 text-center sm:px-14 sm:py-16"
      >
        <div className="frost-sheen pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <m.div
            {...rise(0)}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-popover/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
          >
            <span className="frost-badge-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            software engineer
          </m.div>
          <m.h1
            {...rise(0.08)}
            className="mt-7 font-display text-5xl font-bold tracking-tight text-foreground sm:text-7xl"
          >
            Pawan Danani
          </m.h1>
          <m.p
            {...rise(0.16)}
            className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            I build resilient, distributed systems through hands-on lab projects — fault-tolerant services and event pipelines, learned by shipping.
          </m.p>
          <m.ul {...rise(0.24)} className="mt-7 flex flex-wrap justify-center gap-2">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border bg-secondary/70 px-3 py-1 font-mono text-xs text-secondary-foreground backdrop-blur"
              >
                {tech}
              </li>
            ))}
          </m.ul>
          <m.div {...rise(0.32)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: '0 10px 30px -12px var(--primary)' }}
            >
              View projects
            </a>
            <a
              href="#"
              className="rounded-lg border border-border bg-popover/50 px-6 py-2.5 font-medium text-foreground backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              About
            </a>
          </m.div>
        </div>
      </m.section>
    </main>
  )
}
