import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function CsgoHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const feed = [
    { k: 'race', frag: 'PawanD', victim: 'race_condition' },
    { k: 'p99', frag: 'PawanD', victim: 'p99_latency' },
  ]
  const loadout = [
    { k: 'spring', code: '1', name: 'Spring Boot', price: '$2700' },
    { k: 'pg', code: '2', name: 'Postgres', price: '$4750' },
    { k: 'redis', code: '3', name: 'Redis', price: '$1050' },
    { k: 'kafka', code: '4', name: 'Kafka', price: '$3000' },
  ]
  const nav = ['PROJECTS', 'ABOUT', 'CONTACT']
  const pips = [0, 1, 2, 3]

  return (
    <main className="relative isolate min-h-screen overflow-hidden font-sans">
      {/* Dust II desert backdrop (original geometric CSS art) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="csgo-scene" />
        <div className="csgo-sun" />
        <div className="csgo-wall" style={{ left: 0, bottom: 0, width: '24%', height: '46%' }} />
        <div className="csgo-wall" style={{ right: 0, bottom: 0, width: '28%', height: '54%' }} />
        <div className="csgo-arch" style={{ left: '38%' }} />
        <div className="csgo-crate" style={{ left: '20%', bottom: 0, width: 96, height: 96 }} />
        <div className="csgo-crate" style={{ left: '27%', bottom: 0, width: 72, height: 72 }} />
        <div className="csgo-crate" style={{ right: '20%', bottom: 0, width: 84, height: 84 }} />
        <div className="csgo-haze" />
      </div>

      {/* TOP CENTER — round timer + score + round indicator */}
      <m.div
        {...rise(0)}
        className="csgo-plate absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-4 px-5 py-2"
      >
        <span className="font-display text-lg font-extrabold text-brand-cyan">CT 9</span>
        <div className="flex flex-col items-center">
          <span className="font-mono text-xl font-bold tabular-nums text-foreground">1:14</span>
          <span className="flex items-center gap-1 csgo-label text-[9px]">
            <i className="csgo-bomb" /> RD 16
          </span>
        </div>
        <span className="font-display text-lg font-extrabold text-brand-amber">6 T</span>
      </m.div>

      {/* TOP LEFT — radar */}
      <m.div {...rise(0.06)} className="csgo-plate absolute left-5 top-5 z-20 w-44 p-3">
        <span className="csgo-accentbar" />
        <div className="mb-2 flex items-center justify-between">
          <span className="csgo-label text-[10px]">RADAR · DE_DUST2</span>
          <span className="font-mono text-[9px] text-secondary">$16000</span>
        </div>
        <div className="relative h-32 w-full overflow-hidden rounded-[var(--radius)] border border-border bg-popover">
          <div className="csgo-radar-grid" />
          <div className="csgo-radar-room" style={{ left: '8%', top: '10%', width: '34%', height: '34%' }} />
          <span className="csgo-sitemark" style={{ left: '18%', top: '20%' }}>A</span>
          <div className="csgo-radar-room" style={{ right: '8%', bottom: '10%', width: '36%', height: '36%' }} />
          <span className="csgo-sitemark" style={{ right: '18%', bottom: '18%' }}>B</span>
          <div className="csgo-radar-room" style={{ left: '40%', top: '40%', width: '26%', height: '18%' }} />
          <span className="csgo-dot csgo-dot--ct" style={{ left: '24%', top: '26%' }} />
          <span className="csgo-dot csgo-dot--ct" style={{ left: '48%', top: '50%' }} />
          <span className="csgo-dot csgo-dot--t" style={{ right: '22%', bottom: '24%' }} />
        </div>
      </m.div>

      {/* TOP RIGHT — kill feed */}
      <m.div {...rise(0.12)} className="absolute right-5 top-5 z-20 flex flex-col items-end gap-1.5">
        {feed.map((f) => (
          <div key={f.k} className="csgo-plate flex items-center gap-2 px-3 py-1.5">
            <span className="font-display text-xs font-bold text-brand-cyan">{f.frag}</span>
            <span className="text-brand-amber" aria-hidden>
              ▮
            </span>
            <span className="font-mono text-xs text-muted-foreground">{f.victim}</span>
          </div>
        ))}
      </m.div>

      {/* CENTER — identity + crosshair */}
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <m.div {...rise(0.18)} className="csgo-cross mb-7" aria-hidden />
        <m.p {...rise(0.22)} className="csgo-label text-[11px]">
          // SOFTWARE ENGINEER
        </m.p>
        <m.h1
          {...rise(0.28)}
          className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight text-foreground drop-shadow-[0_2px_10px_oklch(0.12_0.04_250_/_0.6)] sm:text-7xl"
        >
          Pawan Danani
        </m.h1>

        {/* Buy-menu loadout */}
        <m.div {...rise(0.36)} className="csgo-plate relative mt-9 w-full max-w-md p-4 text-left">
          <span className="csgo-accentbar" />
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <span className="csgo-label text-[10px]">BUY MENU · LOADOUT</span>
            <span className="csgo-label text-[10px]">EQUIP</span>
          </div>
          <ul className="space-y-1.5">
            {loadout.map((item) => (
              <li key={item.k} className="flex items-center justify-between font-mono text-sm">
                <span className="flex items-center gap-2.5">
                  <span className="csgo-key">{item.code}</span>
                  <span className="text-foreground">{item.name}</span>
                </span>
                <span className="csgo-price">{item.price}</span>
              </li>
            ))}
          </ul>
        </m.div>

        {/* Nav as HUD buttons */}
        <m.nav {...rise(0.44)} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {nav.map((n) => (
            <a key={n} href="#" className="csgo-nav px-5 py-2.5 text-xs font-bold">
              {n}
            </a>
          ))}
        </m.nav>
      </div>

      {/* BOTTOM LEFT — health + armor */}
      <m.div {...rise(0.2)} className="csgo-plate absolute bottom-5 left-5 z-20 w-52 p-3">
        <span className="csgo-accentbar" />
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-display text-lg font-extrabold text-foreground">
            <span className="text-destructive" aria-hidden>
              ✚
            </span>
            100
          </span>
          <span className="csgo-label text-[10px]">HEALTH</span>
        </div>
        <div className="csgo-bar mb-3">
          <span style={{ width: '100%', background: 'var(--destructive)' }} />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-base font-bold text-foreground">100</span>
          <span className="csgo-label text-[10px]">KEVLAR + HELMET</span>
        </div>
        <div className="csgo-bar">
          <span style={{ width: '100%', background: 'var(--brand-cyan)' }} />
        </div>
      </m.div>

      {/* BOTTOM RIGHT — ammo + grenade pips */}
      <m.div {...rise(0.26)} className="csgo-plate absolute bottom-5 right-5 z-20 p-3 text-right">
        <span className="csgo-label text-[10px]">AK-47</span>
        <div className="mt-1 flex items-baseline justify-end gap-1 font-mono tabular-nums">
          <span className="text-3xl font-bold text-foreground">30</span>
          <span className="text-lg text-muted-foreground">/ 90</span>
        </div>
        <div className="mt-2 flex items-center justify-end gap-1">
          {pips.map((p) => (
            <span key={p} className={p < 3 ? 'csgo-pip' : 'csgo-pip csgo-pip--off'} />
          ))}
        </div>
      </m.div>
    </main>
  )
}
