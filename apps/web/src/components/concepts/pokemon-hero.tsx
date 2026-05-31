import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Pokemon — original turn-based battle UI homage. CSS art only, no trademarks. */
const types = [
  { k: 'spring', label: 'Spring Boot', el: 'GRASS', cls: 'bg-secondary text-secondary-foreground' },
  { k: 'pg', label: 'Postgres', el: 'WATER', cls: 'bg-accent text-accent-foreground' },
  { k: 'redis', label: 'Redis', el: 'FIRE', cls: 'bg-brand-amber text-foreground' },
  { k: 'kafka', label: 'Kafka', el: 'WATER', cls: 'bg-accent text-accent-foreground' },
] as const

const commands = [
  { k: 'projects', label: 'PROJECTS' },
  { k: 'skills', label: 'SKILLS' },
  { k: 'about', label: 'ABOUT' },
  { k: 'contact', label: 'CONTACT' },
] as const

export function PokemonHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })
  const slideFrom = (x: number, delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden">
      {/* Route backdrop (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="pokemon-route" />
        <div className="pokemon-hill" style={{ top: '34%', right: '-6%', width: 360, height: 150 }} />
        <div className="pokemon-hill" style={{ bottom: '20%', left: '-8%', width: 420, height: 170 }} />
        <div className="pokemon-scan" />
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 pt-8 font-display text-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.12em] sm:text-xs">Battle Mode</span>
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.1em] text-foreground/80 sm:text-[11px]">
          <span>$ <span className="text-primary">∞ exp</span></span>
          <span aria-hidden className="hidden sm:inline">/</span>
          <span className="hidden sm:inline">Route 1</span>
        </div>
      </m.div>

      {/* Battle field */}
      <div className="relative mx-auto w-full max-w-5xl flex-1 px-6">
        {/* Opponent stats panel — upper left */}
        <m.div
          {...slideFrom(-26, 0.12)}
          className="pokemon-panel surface absolute left-6 top-6 w-[270px] max-w-[70vw] bg-card p-3 sm:left-6 sm:top-8 sm:w-[300px]"
        >
          <div className="flex items-baseline justify-between font-display text-[10px] uppercase text-card-foreground sm:text-[11px]">
            <span>Wild Bug</span>
            <span className="text-muted-foreground">Lv99</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-[8px] tracking-wider text-secondary sm:text-[9px]">HP</span>
            <div className="pokemon-bar flex-1">
              <div className="pokemon-bar-fill" style={{ width: '34%' }} />
            </div>
          </div>
          <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">34 / 100</p>
        </m.div>

        {/* Opponent creature on platform — upper right */}
        <div aria-hidden className="absolute right-8 top-4 sm:right-16 sm:top-10">
          <m.div {...rise(0.2)} className="relative grid place-items-center">
            <div className="pokemon-platform absolute" style={{ width: 150, height: 42, bottom: -10 }} />
            <div className="pokemon-mon pokemon-mon-foe">
              <span className="pokemon-mon-foe-ear" style={{ left: 12 }} />
              <span className="pokemon-mon-foe-ear" style={{ right: 12 }} />
            </div>
          </m.div>
        </div>

        {/* Player creature on platform — lower left */}
        <div aria-hidden className="absolute bottom-[34%] left-8 sm:bottom-[30%] sm:left-20">
          <m.div {...rise(0.28)} className="relative grid place-items-center">
            <div className="pokemon-platform absolute" style={{ width: 176, height: 48, bottom: -12 }} />
            <div className="pokemon-mon pokemon-mon-hero">
              <span className="pokemon-mon-hero-fin" />
            </div>
          </m.div>
        </div>

        {/* Player stats panel — lower right */}
        <m.div
          {...slideFrom(26, 0.2)}
          className="pokemon-panel surface absolute bottom-[30%] right-6 w-[300px] max-w-[78vw] bg-card p-3 sm:bottom-[26%] sm:right-6 sm:w-[330px]"
        >
          <div className="flex items-baseline justify-between font-display text-[10px] uppercase text-card-foreground sm:text-[11px]">
            <span>Pawan Danani</span>
            <span className="text-primary">Lv.∞</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-[8px] tracking-wider text-secondary sm:text-[9px]">HP</span>
            <div className="pokemon-bar flex-1">
              <div className="pokemon-bar-fill" style={{ width: '88%' }} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-[8px] tracking-wider text-accent sm:text-[9px]">XP</span>
            <div className="pokemon-bar flex-1">
              <div className="pokemon-bar-fill pokemon-bar-fill--xp" style={{ width: '72%' }} />
            </div>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {types.map((t) => (
              <li
                key={t.k}
                className={`pokemon-chip ${t.cls} px-2 py-1 font-display text-[7px] uppercase tracking-wider sm:text-[8px]`}
              >
                {t.label}
              </li>
            ))}
          </ul>
        </m.div>
      </div>

      {/* Message + command box across the bottom */}
      <m.div
        {...rise(0.36)}
        className="mx-auto w-full max-w-5xl px-6 pb-8"
      >
        <div className="pokemon-panel surface grid grid-cols-1 gap-px bg-card sm:grid-cols-[1.55fr_1fr]">
          {/* Message */}
          <div className="border-b-3 border-border p-5 sm:border-b-0 sm:border-r-3 sm:p-6">
            <p className="font-display text-[9px] uppercase tracking-[0.12em] text-primary sm:text-[10px]">
              Pawan Danani — Software Engineer
            </p>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-popover-foreground sm:text-base">
              It&rsquo;s dangerous to ship alone — pick your move. Building
              resilient, distributed systems with Spring Boot, Postgres, Redis
              &amp; Kafka, battle-tested through hands-on labs.
              <span aria-hidden className="pokemon-prompt ml-1 font-display text-primary">▼</span>
            </p>
          </div>

          {/* 2x2 command menu — CTAs */}
          <nav className="grid grid-cols-2 gap-x-2 gap-y-3 p-5 font-display text-[10px] uppercase tracking-wider text-card-foreground sm:p-6 sm:text-xs">
            {commands.map((c, i) => (
              <a key={c.k} href="#" className="pokemon-cmd hover:text-primary">
                <span aria-hidden className={i === 0 ? 'pokemon-cursor' : 'opacity-0'}>
                  {'►'}
                </span>
                {c.label}
              </a>
            ))}
          </nav>
        </div>
      </m.div>
    </main>
  )
}
