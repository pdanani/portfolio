import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Zelda — 16-bit top-down overworld quest. Original CSS art only. */
const stack = ['Spring Boot', 'Postgres', 'Redis', 'Kafka'] as const

type Spot = { k: string; top: string; left?: string; right?: string }

const trees: Array<Spot> = [
  { k: 't1', top: '16%', left: '8%' },
  { k: 't2', top: '62%', left: '12%' },
  { k: 't3', top: '24%', right: '10%' },
  { k: 't4', top: '70%', right: '14%' },
  { k: 't5', top: '46%', left: '4%' },
]

const rocks: Array<Spot> = [
  { k: 'r1', top: '34%', left: '20%' },
  { k: 'r2', top: '78%', left: '30%' },
  { k: 'r3', top: '18%', right: '24%' },
]

const hearts = [
  { k: 'h1', empty: false },
  { k: 'h2', empty: false },
  { k: 'h3', empty: false },
  { k: 'h4', empty: true },
] as const

export function ZeldaHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Overworld scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="zelda-field" />
        <div className="zelda-path" />
        {trees.map((t) => (
          <div
            key={t.k}
            className="zelda-tree"
            style={{ top: t.top, left: t.left, right: t.right }}
          />
        ))}
        {rocks.map((r) => (
          <div
            key={r.k}
            className="zelda-rock"
            style={{ top: r.top, left: r.left, right: r.right }}
          />
        ))}
        <div className="zelda-pond" style={{ bottom: '8%', left: '6%' }} />
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 pt-8 text-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="zelda-emblem" />
          <span className="hidden font-display text-[10px] uppercase tracking-[0.12em] text-foreground/80 sm:inline">
            Hyrule Dev Co.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hearts.map((h) => (
            <span
              key={h.k}
              className={h.empty ? 'zelda-heart zelda-heart--empty' : 'zelda-heart'}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 font-display text-[10px] text-foreground/90 sm:text-xs">
          <span className="zelda-gem" />
          <span className="text-primary">x255</span>
        </div>
      </m.div>

      {/* Centered content */}
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col justify-center px-6 pb-24">
        <m.p
          {...rise(0.08)}
          className="font-display text-[10px] uppercase tracking-[0.16em] text-accent sm:text-xs"
        >
          <span className="bg-popover px-2 py-1" style={{ boxShadow: '3px 3px 0 var(--border)' }}>
            QUEST LOG — SOFTWARE ENGINEER
          </span>
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="zelda-title mt-8 font-display text-2xl leading-tight sm:text-5xl"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.div
          {...rise(0.3)}
          className="zelda-textbox mt-10 max-w-2xl p-6 sm:p-7"
        >
          <p className="font-display text-[10px] uppercase leading-relaxed tracking-[0.1em] text-primary sm:text-xs">
            It&rsquo;s dangerous to ship alone! Take these:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {stack.map((s) => (
              <li
                key={s}
                className="border-2 border-primary bg-card px-3 py-1.5 font-mono text-xs text-card-foreground sm:text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-popover-foreground/90 sm:text-base">
            Building resilient, distributed systems one lab quest at a time —
            forging fault-tolerant services that survive every dungeon.
          </p>
          <span aria-hidden className="zelda-cont font-display text-xs">
            {'▼'}
          </span>
        </m.div>

        <m.div {...rise(0.44)} className="mt-9 flex flex-col gap-3 font-display text-[11px] uppercase tracking-wider sm:text-xs">
          <a
            href="#"
            className="zelda-btn w-fit bg-primary px-6 py-3 text-primary-foreground"
          >
            <span aria-hidden className="zelda-cursor">{'►'}</span>
            View projects
          </a>
          <a
            href="#"
            className="zelda-btn w-fit bg-secondary px-6 py-3 text-secondary-foreground"
          >
            <span aria-hidden style={{ opacity: 0 }}>{'►'}</span>
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
