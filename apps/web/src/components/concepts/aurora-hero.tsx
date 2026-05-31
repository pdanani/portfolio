import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Aurora Violet — centered glassmorphism hero with a gradient headline. */
export function AuroraHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
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
      <m.p {...rise(0.16)} className="mt-6 max-w-xl text-lg text-muted-foreground">
        Full-stack engineer shipping production software and exploring
        distributed systems through hands-on lab projects.
      </m.p>
      <m.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-3">
        <a
          href="#"
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          View projects
        </a>
        <a
          href="#"
          className="rounded-lg border border-border px-5 py-2.5 font-medium transition hover:bg-accent"
        >
          About me
        </a>
      </m.div>
    </main>
  )
}
