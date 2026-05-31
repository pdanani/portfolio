import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Pokemon — top-down overworld town/route. Original geometric CSS art, no trademarks. */
const stack = [
  { k: 'spring', label: 'SPRING BOOT' },
  { k: 'pg', label: 'POSTGRES' },
  { k: 'redis', label: 'REDIS' },
  { k: 'kafka', label: 'KAFKA' },
] as const

const signs = [
  { k: 'projects', label: 'PROJECTS' },
  { k: 'about', label: 'ABOUT' },
  { k: 'contact', label: 'CONTACT' },
] as const

// scattered tall-grass encounter patches (top/left in %, scale)
const tufts = [
  { k: 't1', top: 16, left: 9, s: 1 },
  { k: 't2', top: 22, left: 20, s: 0.85 },
  { k: 't3', top: 70, left: 13, s: 1.1 },
  { k: 't4', top: 78, left: 26, s: 0.9 },
  { k: 't5', top: 30, left: 80, s: 1 },
  { k: 't6', top: 64, left: 86, s: 0.85 },
  { k: 't7', top: 84, left: 72, s: 1.05 },
  { k: 't8', top: 12, left: 64, s: 0.8 },
] as const

export function PokemonHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })
  const pop = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.5, ease: EASE, delay },
  })

  return (
    <main className="pokemon-grass relative isolate min-h-screen overflow-hidden">
      {/* Overworld scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* tiled grass + checker pattern fills via .pokemon-grass on <main> */}
        <div className="pokemon-tiles absolute inset-0" />

        {/* winding dirt path crossing the scene */}
        <div className="pokemon-path" />
        <div className="pokemon-path pokemon-path--cross" />

        {/* pond, lower-left */}
        <div className="pokemon-pond" style={{ bottom: '7%', left: '4%' }} />

        {/* trees */}
        <div className="pokemon-tree" style={{ top: '8%', left: '40%' }} />
        <div className="pokemon-tree" style={{ bottom: '20%', right: '6%' }} />

        {/* houses */}
        <div className="pokemon-house" style={{ top: '11%', right: '9%' }}>
          <div className="pokemon-house-roof" />
          <div className="pokemon-house-body">
            <span className="pokemon-house-door" />
            <span className="pokemon-house-window" style={{ left: 10 }} />
            <span className="pokemon-house-window" style={{ right: 10 }} />
          </div>
        </div>
        <div className="pokemon-house pokemon-house--blue" style={{ bottom: '24%', left: '20%' }}>
          <div className="pokemon-house-roof" />
          <div className="pokemon-house-body">
            <span className="pokemon-house-door" />
            <span className="pokemon-house-window" style={{ left: 10 }} />
            <span className="pokemon-house-window" style={{ right: 10 }} />
          </div>
        </div>

        {/* fence run near top path */}
        <div className="pokemon-fence" style={{ top: '46%', left: '6%' }} />

        {/* tall-grass encounter patches */}
        {tufts.map((t) => (
          <div
            key={t.k}
            className="pokemon-tuft"
            style={{ top: `${t.top}%`, left: `${t.left}%`, transform: `scale(${t.s})` }}
          >
            <span /><span /><span /><span />
          </div>
        ))}

        {/* a small NPC standing by the blue house */}
        <div className="pokemon-npc" style={{ bottom: '30%', left: '33%' }}>
          <span className="pokemon-npc-head" />
          <span className="pokemon-npc-body" />
        </div>
      </div>

      {/* Top sign / HUD */}
      <m.div
        {...rise(0)}
        className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-6 pt-8"
      >
        <span className="surface pokemon-sign inline-flex items-center gap-2 bg-card px-3 py-2 font-display text-[9px] uppercase tracking-[0.12em] text-card-foreground sm:text-[10px]">
          <span aria-hidden className="pokemon-pin" />
          PALLET ROUTE
        </span>
        <span className="surface pokemon-sign hidden items-center bg-card px-3 py-2 font-display text-[9px] uppercase tracking-[0.1em] text-muted-foreground sm:inline-flex sm:text-[10px]">
          <span className="text-secondary">EXPLORE</span>
          <span aria-hidden className="mx-2 text-border">/</span>
          <span className="text-accent">ROUTE&nbsp;1</span>
        </span>
      </m.div>

      {/* Hero content — readable sign panels over the grass */}
      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col justify-center px-6 pb-16">
        <m.div {...rise(0.1)} className="max-w-2xl">
          <span className="surface pokemon-sign inline-block bg-card px-3 py-2 font-display text-[9px] uppercase tracking-[0.16em] text-secondary-foreground sm:text-[10px]">
            <span className="bg-secondary px-2 py-1 text-secondary-foreground">SOFTWARE ENGINEER</span>
          </span>
        </m.div>

        <m.div
          {...rise(0.18)}
          className="surface pokemon-sign mt-6 inline-block w-fit bg-card px-5 py-5 sm:px-7 sm:py-6"
        >
          <h1 className="pokemon-title font-display text-2xl leading-[1.35] text-card-foreground sm:text-4xl">
            Pawan
            <br />
            Danani
          </h1>
        </m.div>

        <m.div
          {...rise(0.28)}
          className="surface pokemon-sign mt-5 max-w-xl bg-card px-5 py-4 sm:px-6 sm:py-5"
        >
          <p className="font-display text-[8px] uppercase tracking-[0.1em] text-primary sm:text-[9px]">
            <span aria-hidden className="pokemon-prompt mr-1">▶</span>
            Press to explore
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-popover-foreground sm:text-base">
            Building resilient, distributed systems one route at a time — wiring
            together services and battle-testing them in hands-on labs.
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <li
                key={s.k}
                className="pokemon-chip bg-muted px-2 py-1 font-display text-[7px] uppercase tracking-wider text-foreground sm:text-[8px]"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </m.div>

        {/* Wooden signposts = navigation */}
        <nav className="mt-8 flex flex-wrap gap-4">
          {signs.map((s, i) => (
            <m.a
              key={s.k}
              {...pop(0.4 + i * 0.08)}
              href="#"
              className="pokemon-post group font-display text-[10px] uppercase tracking-wider sm:text-xs"
            >
              <span className="pokemon-post-board">
                <span aria-hidden className="pokemon-cursor">►</span>
                {s.label}
              </span>
              <span aria-hidden className="pokemon-post-leg" />
            </m.a>
          ))}
        </nav>
      </div>

      {/* trainer avatar standing on the path (original chunky figure) */}
      <m.div
        {...(reduce
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.01 } }
          : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay: 0.34 } })}
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] right-[14%] z-0 sm:right-[20%]"
      >
        <div className="pokemon-trainer">
          <span className="pokemon-trainer-cap" />
          <span className="pokemon-trainer-head" />
          <span className="pokemon-trainer-torso" />
          <span className="pokemon-trainer-legs" />
          <span className="pokemon-trainer-shadow" />
        </div>
      </m.div>
    </main>
  )
}
