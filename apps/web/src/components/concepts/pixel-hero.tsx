import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Pixel — 8/16-bit retro game UI: RPG dialog textbox, chunky pixel buttons, blinking PRESS START. */
const stats = ['SPRING BOOT', 'POSTGRES', 'REDIS', 'KAFKA'] as const

export function PixelHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.5, ease: EASE, delay },
  })

  return (
    <main className="pixel-scanlines relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
      <m.section
        {...rise(0)}
        className="pixel-panel relative w-full max-w-3xl p-7 sm:p-10"
      >
        <m.p
          {...rise(0.08)}
          className="font-display text-[0.6rem] uppercase leading-relaxed tracking-[0.15em] text-brand-cyan sm:text-xs"
        >
          PLAYER 1 — SOFTWARE ENGINEER
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="pixel-title mt-6 font-display text-2xl uppercase leading-[1.5] text-primary sm:text-4xl sm:leading-[1.45]"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.26)}
          className="mt-7 max-w-xl font-sans text-base leading-relaxed text-foreground/90"
        >
          Building resilient, distributed systems through hands-on lab quests —
          forging fault-tolerant services with the tools below.
        </m.p>

        <m.ul {...rise(0.34)} className="mt-6 flex flex-wrap gap-2">
          {stats.map((s) => (
            <li
              key={s}
              className="border-2 border-border bg-secondary px-3 py-1.5 font-display text-[0.55rem] uppercase tracking-wider text-secondary-foreground"
            >
              {s}
            </li>
          ))}
        </m.ul>

        <m.div {...rise(0.44)} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="pixel-btn bg-primary px-6 py-3 font-display text-[0.6rem] uppercase tracking-wider text-primary-foreground"
          >
            View projects
          </a>
          <a
            href="#"
            className="pixel-btn bg-secondary px-6 py-3 font-display text-[0.6rem] uppercase tracking-wider text-secondary-foreground"
          >
            About
          </a>
        </m.div>

        <m.p
          {...rise(0.54)}
          className="pixel-start mt-9 font-display text-[0.6rem] uppercase tracking-[0.2em] text-brand-cyan sm:text-xs"
        >
          {'▶'} PRESS START
        </m.p>
      </m.section>
    </main>
  )
}
