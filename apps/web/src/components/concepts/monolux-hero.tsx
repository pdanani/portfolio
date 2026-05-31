import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

const LINKS = [
  { label: 'Projects', n: '01' },
  { label: 'About', n: '02' },
  { label: 'Contact', n: '03' },
]

/** Monolux — award-site monochrome: near-black, off-white, one whisper accent, oversized Archivo. */
export function MonoluxHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 py-10 sm:px-12 sm:py-14">
      <div className="monolux-vignette pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <m.header
        {...rise(0)}
        className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
      >
        <span className="flex items-center gap-2.5">
          <span className="monolux-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Available for work
        </span>
        <span className="hidden sm:inline">Bengaluru, IN — MMXXVI</span>
      </m.header>

      <div className="mx-auto w-full max-w-6xl">
        <m.p
          {...rise(0.1)}
          className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground"
        >
          Software Engineer
        </m.p>

        <m.h1
          {...rise(0.18)}
          className="mt-6 font-display text-[clamp(3.5rem,15vw,12rem)] font-semibold leading-[0.86] tracking-[-0.03em] text-foreground"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.div {...rise(0.3)} className="mt-10 h-px w-full bg-border" />

        <m.p
          {...rise(0.38)}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Building resilient, distributed systems the way that sticks — by hand.
          Each lab project pairs a Spring Boot service with Postgres, Redis, and
          Kafka, fully documented and deployable.
        </m.p>

        <m.div {...rise(0.5)} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            View projects
          </a>
          <a
            href="#"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            About
          </a>
        </m.div>
      </div>

      <m.nav
        {...rise(0.6)}
        className="flex flex-wrap items-end justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <ul className="flex flex-wrap gap-6 sm:gap-8">
          {LINKS.map((l) => (
            <li key={l.n} className="flex items-baseline gap-1.5">
              <span className="text-[0.6rem] text-accent">{l.n}</span>
              <a href="#" className="monolux-link text-foreground transition-colors hover:text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span>© MMXXVI</span>
      </m.nav>
    </main>
  )
}
