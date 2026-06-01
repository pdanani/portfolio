import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

type Side = 'CT' | 'T'
type Player = {
  id: string
  name: string
  side: Side
  shipped: number
  bugs: number
  rps: number
  cov: number
  proj: number
  mvp?: boolean
}

const ROSTER: Player[] = [
  { id: 'p1', name: 'Pawan Danani', side: 'CT', shipped: 248, bugs: 19, rps: 1420, cov: 94, proj: 12, mvp: true },
  { id: 'p2', name: 'edge_runner', side: 'CT', shipped: 171, bugs: 28, rps: 980, cov: 81, proj: 7 },
  { id: 'p3', name: 'null_ptr', side: 'CT', shipped: 142, bugs: 41, rps: 770, cov: 68, proj: 5 },
  { id: 'p4', name: 'async_ava', side: 'T', shipped: 188, bugs: 33, rps: 1010, cov: 76, proj: 8 },
  { id: 'p5', name: 'kernel_kai', side: 'T', shipped: 133, bugs: 47, rps: 690, cov: 63, proj: 4 },
]

const TABS = ['SCOREBOARD', 'WORK', 'STACK', 'CONTACT']
const HEADERS = ['SHIPPED', 'BUGS', 'RPS', 'COV%', 'PROJ']

export function CsgoTwoHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })
  const cell = (p: Player) => [p.shipped, p.bugs, p.rps, `${p.cov}%`, p.proj]

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground font-sans">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 csgo2-glow" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 csgo2-grid" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 csgo2-scan opacity-60" />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-5 px-6 py-10">
        {/* Top bar: match result + tabs */}
        <m.header {...rise(0)} className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="csgo2-tick inline-block h-2 w-2 rounded-full bg-destructive" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              competitive // match complete
            </span>
          </div>
          <nav className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest">
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`rounded-[var(--radius)] px-3 py-1.5 text-muted-foreground transition hover:text-foreground ${
                  i === 0 ? 'csgo2-tab-active' : ''
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </m.header>

        {/* Scoreline banner */}
        <m.div {...rise(0.08)} className="surface csgo2-panel relative flex items-stretch overflow-hidden rounded-[var(--radius)]">
          <span className="csgo2-corner csgo2-corner--tl" />
          <span className="csgo2-corner csgo2-corner--tr" />
          <span className="csgo2-corner csgo2-corner--bl" />
          <span className="csgo2-corner csgo2-corner--br" />
          <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">CT · SHIPPERS</span>
              <span className="rounded-[var(--radius)] bg-brand-amber/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-amber">
                victory
              </span>
            </div>
            <div className="flex items-center gap-3 font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
              <span className="text-primary">16</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-muted-foreground">9</span>
            </div>
            <span className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">T · CRASHERS</span>
          </div>
        </m.div>

        {/* MVP card */}
        <m.div {...rise(0.16)} className="surface csgo2-panel flex flex-wrap items-center gap-4 rounded-[var(--radius)] px-5 py-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] bg-brand-amber/15 ring-1 ring-brand-amber/40">
            <svg viewBox="0 0 24 24" className="csgo2-star h-8 w-8" fill="oklch(0.82 0.14 85)" aria-hidden>
              <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.9 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-amber">round mvp</div>
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              Pawan Danani
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              full-stack engineer · clutch deploys · <span className="text-brand">+229 net commits</span>
            </p>
          </div>
          <a
            href="#work"
            className="csgo2-cta shrink-0 rounded-[var(--radius)] px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            View projects →
          </a>
        </m.div>

        {/* Scoreboard table */}
        <m.section {...rise(0.24)} className="surface csgo2-panel overflow-hidden rounded-[var(--radius)]">
          <div className="grid grid-cols-[1.6fr_repeat(5,minmax(0,1fr))] gap-2 border-b border-border bg-secondary/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>player</span>
            {HEADERS.map((h) => (
              <span key={h} className="text-right">{h}</span>
            ))}
          </div>
          {ROSTER.map((p) => (
            <div
              key={p.id}
              className={`csgo2-row grid grid-cols-[1.6fr_repeat(5,minmax(0,1fr))] items-center gap-2 px-4 py-2.5 ${
                p.mvp ? 'csgo2-row-mvp' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: p.side === 'CT' ? 'var(--primary)' : 'oklch(0.7 0.1 60)' }}
                />
                <span className={`truncate font-medium ${p.mvp ? 'font-display font-bold text-brand-amber' : 'text-card-foreground'}`}>
                  {p.name}
                </span>
                {p.mvp && (
                  <span className="rounded-[2px] bg-brand-amber/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand-amber">
                    mvp
                  </span>
                )}
              </div>
              {cell(p).map((v, ci) => (
                <span
                  key={ci}
                  className={`text-right font-mono text-sm tabular-nums ${
                    ci === 1 ? 'text-muted-foreground' : p.mvp ? 'text-brand' : 'text-card-foreground/90'
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          ))}
        </m.section>

        {/* Footer stat bars */}
        <m.footer {...rise(0.32)} className="grid gap-3 font-mono text-[11px] sm:grid-cols-3">
          {[
            { k: 'cov', label: 'TEST COVERAGE', val: '94%', pct: 94, color: 'var(--brand)' },
            { k: 'rps', label: 'THROUGHPUT', val: '1.42K rps', pct: 78, color: 'var(--primary)' },
            { k: 'kd', label: 'SHIP / BUG', val: '13.1', pct: 88, color: 'var(--brand-amber)' },
          ].map((s) => (
            <div key={s.k} className="surface csgo2-panel rounded-[var(--radius)] px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <span className="font-bold text-foreground">{s.val}</span>
              </div>
              <div className="csgo2-bar">
                <span style={{ width: reduce ? `${s.pct}%` : `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </m.footer>
      </div>
    </main>
  )
}
