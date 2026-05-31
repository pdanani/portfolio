import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Arcade — full-bleed retro space arcade-cabinet screen at night. */
const hud = [
  { k: 'hi', label: 'HI-SCORE', value: '999999' },
  { k: '1up', label: '1UP', value: '042700' },
  { k: 'lvl', label: 'CREDITS', value: '03' },
] as const

const skills = ['SPRING BOOT', 'POSTGRES', 'REDIS', 'KAFKA'] as const

export function ArcadeHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.55, ease: EASE, delay },
  })

  return (
    <main className="arcade-screen relative isolate min-h-screen overflow-hidden bg-background">
      {/* Full-viewport space scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="arcade-stars" />
        <div className="arcade-stars arcade-stars--far" />
        <div className="arcade-twinkle" style={{ top: '18%', left: '22%' }} />
        <div className="arcade-twinkle" style={{ top: '30%', right: '18%' }} />
        <div className="arcade-twinkle" style={{ top: '12%', right: '34%' }} />

        {/* Pixel moon, upper-right */}
        <div className="arcade-moon" style={{ top: '12%', right: '9%' }}>
          <span className="arcade-moon__crater" style={{ top: 14, left: 18 }} />
          <span className="arcade-moon__crater" style={{ top: 34, left: 40 }} />
          <span className="arcade-moon__crater" style={{ top: 46, left: 16 }} />
        </div>

        {/* Floating asteroid blocks scattered across the field */}
        <div className="arcade-block" style={{ top: '24%', left: '8%' }} />
        <div className="arcade-block" style={{ top: '62%', right: '13%' }} />
        <div className="arcade-block arcade-block--sm" style={{ top: '46%', left: '4%' }} />
        <div className="arcade-block arcade-block--sm" style={{ top: '70%', left: '16%' }} />

        {/* Pixel invader sprite, left field */}
        <div className="arcade-invader" style={{ top: '38%', left: '13%' }} />
        {/* Pixel player ship, right field */}
        <div className="arcade-ship" style={{ top: '52%', right: '8%' }} />

        {/* Perspective ground grid at the bottom */}
        <div className="arcade-grid" />
        <div className="arcade-horizon" />
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 pt-8 font-display text-foreground"
      >
        <span className="text-[9px] text-brand-cyan sm:text-[11px]">ZONE 1</span>
        <div className="flex gap-4 text-[8px] sm:text-[10px]">
          {hud.map((s) => (
            <span key={s.k} className="text-foreground/75">
              {s.label}{' '}
              <span className={s.k === '1up' ? 'text-brand-amber' : 'text-primary'}>
                {s.value}
              </span>
            </span>
          ))}
        </div>
      </m.div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl flex-col justify-center px-6 pb-28">
        <m.p
          {...rise(0.08)}
          className="font-display text-[9px] uppercase tracking-[0.18em] sm:text-[11px]"
        >
          <span className="arcade-eyebrow bg-secondary px-3 py-2 text-secondary-foreground">
            PLAYER 1 — SOFTWARE ENGINEER
          </span>
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="arcade-title mt-9 font-display text-3xl uppercase leading-[1.4] sm:text-5xl sm:leading-[1.35]"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-foreground/90 sm:text-lg"
        >
          Building resilient, distributed systems that stay online when the
          arcade gets loud — Spring Boot, Postgres, Redis, and Kafka, wired
          together and battle-tested.
        </m.p>

        <m.ul {...rise(0.36)} className="mt-7 flex flex-wrap gap-2">
          {skills.map((s) => (
            <li
              key={s}
              className="arcade-chip bg-muted px-3 py-1.5 font-display text-[8px] uppercase tracking-wider text-foreground sm:text-[9px]"
            >
              {s}
            </li>
          ))}
        </m.ul>

        <m.div {...rise(0.46)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="arcade-btn bg-primary px-6 py-3 font-display text-[10px] uppercase tracking-wider text-primary-foreground sm:text-xs"
          >
            View projects
          </a>
          <a
            href="#"
            className="arcade-btn arcade-btn--coin bg-brand-amber px-6 py-3 font-display text-[10px] uppercase tracking-wider text-background sm:text-xs"
          >
            About
          </a>
        </m.div>
      </div>

      {/* Bottom scoreboard / ground strip */}
      <m.div
        {...rise(0.56)}
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 border-t-2 border-border bg-card/90 px-6 py-4 font-display text-[8px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]"
      >
        <span className="text-brand-cyan">© 1986 DANANI SYSTEMS</span>
        <span className="arcade-coin text-primary">▸ INSERT COIN</span>
      </m.div>
    </main>
  )
}
