import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function VinylHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const strobe = Array.from({ length: 36 }, (_, i) => i)

  const nav = [
    { k: 'n1', code: 'A1', label: 'PROJECTS' },
    { k: 'n2', code: 'A2', label: 'ABOUT' },
    { k: 'n3', code: 'A3', label: 'CONTACT' },
  ]

  const tracks = [
    { k: 't1', no: '01', title: 'Spring Boot', time: '3:42' },
    { k: 't2', no: '02', title: 'Postgres', time: '4:15' },
    { k: 't3', no: '03', title: 'Redis', time: '2:58' },
    { k: 't4', no: '04', title: 'Kafka', time: '5:03' },
  ]

  return (
    <main className="vinyl-room relative isolate grid min-h-screen place-items-center overflow-hidden px-4 py-10 sm:px-6">
      <div aria-hidden className="vinyl-vignette pointer-events-none -z-10" />

      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* The turntable */}
        <m.div {...rise(0.12)} className="vinyl-plinth order-2 lg:order-1">
          <div className="vinyl-deck">
            <div className="flex items-start justify-center">
              <div className="vinyl-platter">
                <span className="vinyl-strobe" aria-hidden>
                  {strobe.map((i) => (
                    <i key={`s-${i}`} style={{ ['--a' as string]: `${i * 10}deg` }} />
                  ))}
                </span>

                <m.div
                  className="vinyl-record"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={
                    reduce
                      ? undefined
                      : { repeat: Infinity, ease: 'linear', duration: 6 }
                  }
                >
                  <span className="vinyl-sheen" aria-hidden />
                  <div className="vinyl-label">
                    <span className="vinyl-label-name font-display">Pawan Danani</span>
                    <span className="vinyl-label-sub font-mono">LP &middot; 33&#8531;</span>
                  </div>
                </m.div>

                <span className="vinyl-spindle" aria-hidden />

                <m.div
                  className="vinyl-tonearm"
                  aria-hidden
                  initial={{ rotate: reduce ? 0 : -6 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: reduce ? 0.01 : 1.1, ease: EASE, delay: 0.5 }}
                >
                  <span className="vinyl-arm-pivot" />
                  <span className="vinyl-arm-counter" />
                  <span className="vinyl-arm-tube">
                    <span className="vinyl-arm-head" />
                  </span>
                </m.div>
              </div>
            </div>

            {/* Deck controls */}
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="vinyl-knob" aria-hidden />
                <button type="button" className="vinyl-btn font-mono text-[11px] tracking-[0.2em] uppercase">
                  <span className="vinyl-btn-led" aria-hidden />
                  Start / Stop
                </button>
              </div>

              <div className="flex items-end gap-4">
                <div className="vinyl-rpm flex gap-1.5 font-mono text-[10px] tracking-[0.15em]">
                  <i data-on="true">33</i>
                  <i data-on="false">45</i>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="vinyl-fader" aria-hidden>
                    <span className="vinyl-fader-cap" />
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                    Pitch
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="vinyl-feet" aria-hidden>
            <span />
            <span />
          </div>
        </m.div>

        {/* Copy + tracklist */}
        <div className="order-1 lg:order-2">
          <m.p
            {...rise(0.18)}
            className="flex items-center gap-2 font-mono text-xs tracking-[0.32em] text-brand-amber uppercase"
          >
            <span className="vinyl-eyebrow-dot" aria-hidden />
            Now Spinning
          </m.p>

          <m.h1 {...rise(0.26)} className="font-display mt-3 text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Pawan Danani
          </m.h1>

          <m.p {...rise(0.34)} className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Resilient distributed systems &mdash; Spring Boot, Postgres, Redis, Kafka.
          </m.p>

          <m.nav {...rise(0.42)} className="mt-6 flex flex-wrap gap-2" aria-label="Sections">
            {nav.map((n) => (
              <a
                key={n.k}
                href="#"
                className="vinyl-btn font-mono text-[11px] tracking-[0.16em] uppercase"
              >
                <span className="text-brand-amber">{n.code}</span>
                <span className="text-foreground/90">{n.label}</span>
              </a>
            ))}
          </m.nav>

          <m.div {...rise(0.5)} className="surface mt-6 rounded-[var(--radius)] border border-border p-3">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-[0.3em] text-brand-amber/90 uppercase">
                Side A
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                The Stack
              </span>
            </div>
            <ul>
              {tracks.map((t) => (
                <li key={t.k} className="vinyl-track">
                  <span className="font-mono text-xs text-brand-amber tabular-nums">{t.no}</span>
                  <span className="vinyl-track-dot" aria-hidden />
                  <span className="flex-1 text-sm font-medium text-foreground">{t.title}</span>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{t.time}</span>
                </li>
              ))}
            </ul>
          </m.div>
        </div>
      </div>
    </main>
  )
}
