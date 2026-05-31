import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function MarioHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const hud = [
    { k: 'world', label: 'WORLD', value: '1-1' },
    { k: 'coins', label: 'COINS', value: 'x08' },
    { k: 'time', label: 'TIME', value: '400' },
  ]

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Sky + scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mario-sky" />
        <div className="mario-cloud" style={{ top: '20%', left: '14%', width: 64, height: 30 }} />
        <div className="mario-cloud" style={{ top: '34%', right: '12%', width: 50, height: 24 }} />
        <div className="mario-pipe" style={{ right: '8%' }} />
        <div className="absolute" style={{ bottom: 84, left: '9%' }}>
          <div className="mario-coin" />
        </div>
        <div className="absolute flex items-end gap-3" style={{ bottom: 196, left: '8%' }}>
          <div className="mario-block mario-block--brick" />
          <div className="mario-block mario-block--q">?</div>
          <div className="mario-block mario-block--brick" />
        </div>
        <div className="mario-ground" />
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 pt-8 font-display text-foreground"
      >
        <span className="text-[10px] sm:text-xs">PUSH START</span>
        <div className="flex gap-4 text-[9px] sm:text-[11px]">
          {hud.map((s) => (
            <span key={s.k} className="text-foreground/80">
              {s.label} <span className="text-primary">{s.value}</span>
            </span>
          ))}
        </div>
      </m.div>

      {/* Hero content */}
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl flex-col justify-center px-6 pb-28">
        <m.p
          {...rise(0.08)}
          className="font-display text-[10px] uppercase tracking-[0.18em] text-secondary-foreground sm:text-xs"
        >
          <span className="bg-secondary px-2 py-1 mario-btn">SOFTWARE ENGINEER</span>
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="mario-title mt-8 font-display text-3xl leading-tight sm:text-5xl"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-foreground sm:text-lg"
        >
          Building resilient, distributed systems one hands-on lab at a time —
          Spring Boot, Postgres, Redis, and Kafka, wired together and battle-tested.
        </m.p>

        <m.div {...rise(0.4)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="mario-btn bg-primary px-6 py-3 font-display text-[11px] uppercase tracking-wider text-primary-foreground sm:text-xs"
          >
            View projects
          </a>
          <a
            href="#"
            className="mario-btn bg-accent px-6 py-3 font-display text-[11px] uppercase tracking-wider text-accent-foreground sm:text-xs"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
