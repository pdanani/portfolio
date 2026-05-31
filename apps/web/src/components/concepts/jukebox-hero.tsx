import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function JukeboxHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const play = (on: boolean) => (reduce ? ('paused' as const) : on ? ('running' as const) : ('paused' as const))

  const selectors = [
    { k: 's1', code: 'A1', label: 'PROJECTS' },
    { k: 's2', code: 'A2', label: 'ABOUT' },
    { k: 's3', code: 'A3', label: 'SKILLS' },
    { k: 's4', code: 'A4', label: 'CONTACT' },
  ]

  const tracks = [
    { k: 't1', no: '01', title: 'Spring Boot', time: '3:42' },
    { k: 't2', no: '02', title: 'Postgres', time: '4:15' },
    { k: 't3', no: '03', title: 'Redis', time: '2:58' },
    { k: 't4', no: '04', title: 'Kafka', time: '5:03' },
  ]

  const bars = [
    { k: 'b1', h: 38, d: '0s' },
    { k: 'b2', h: 70, d: '0.18s' },
    { k: 'b3', h: 52, d: '0.36s' },
    { k: 'b4', h: 88, d: '0.1s' },
    { k: 'b5', h: 44, d: '0.5s' },
  ]

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Diner ambiance backdrop (original CSS art) */}
      <div aria-hidden className="jukebox-room pointer-events-none absolute inset-0 -z-10">
        <div className="jukebox-floor" />
        <div className="jukebox-vignette" />
      </div>

      {/* Top neon sign */}
      <m.div
        {...rise(0.05)}
        className="pointer-events-none absolute top-6 left-1/2 z-10 -translate-x-1/2 sm:top-8"
      >
        <span
          className="jukebox-sign font-display text-base whitespace-nowrap sm:text-xl"
          style={{ animationPlayState: play(true) }}
        >
          Pawan&rsquo;s Jukebox
        </span>
      </m.div>

      <div className="relative flex w-full max-w-4xl flex-col items-center pt-14 sm:pt-16">
        {/* The cabinet */}
        <m.section {...rise(0.14)} className="jukebox-cabinet relative w-full max-w-2xl">
          {/* Arched/domed top with chrome trim + neon tubes */}
          <div className="jukebox-dome">
            <div
              className="jukebox-neon jukebox-neon--magenta"
              style={{ animationPlayState: play(true) }}
            />
            <div
              className="jukebox-neon jukebox-neon--teal"
              style={{ animationPlayState: play(true) }}
            />
            <div className="jukebox-chrome-arc" />

            {/* NOW PLAYING display window */}
            <div className="jukebox-window">
              <div className="jukebox-window-head">
                <span className="font-mono text-[9px] tracking-[0.32em] text-brand-amber/90 uppercase">
                  Now Playing
                </span>
                <span className="jukebox-eq" aria-hidden>
                  {bars.map((b) => (
                    <i
                      key={b.k}
                      style={{ height: `${b.h}%`, animationDelay: b.d, animationPlayState: play(true) }}
                    />
                  ))}
                </span>
              </div>

              <p className="jukebox-name font-display leading-none">Pawan Danani</p>

              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="jukebox-play" aria-hidden>
                  {'▶'}
                </span>
                <span className="font-sans text-[11px] font-medium tracking-[0.18em] text-brand-cyan uppercase sm:text-xs">
                  Software Engineer
                </span>
              </div>
            </div>

            {/* Spinning vinyl, tucked beside the window */}
            <div className="jukebox-vinyl-wrap" aria-hidden>
              <div className="jukebox-vinyl" style={{ animationPlayState: play(true) }}>
                <span className="jukebox-vinyl-label" />
              </div>
            </div>
          </div>

          {/* Cabinet body */}
          <div className="jukebox-body">
            {/* Selection grid — nav */}
            <nav className="grid grid-cols-2 gap-3" aria-label="Sections">
              {selectors.map((s) => (
                <a key={s.k} href="#" className="jukebox-selector group">
                  <span className="jukebox-selector-code font-mono">{s.code}</span>
                  <span className="jukebox-selector-sep" aria-hidden>
                    {'·'}
                  </span>
                  <span className="font-sans text-sm font-semibold tracking-wide">{s.label}</span>
                </a>
              ))}
            </nav>

            {/* Track list strip — the stack as records */}
            <div className="jukebox-tracks">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] text-brand-amber/80 uppercase">
                  Side A
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                  The Stack
                </span>
              </div>
              <ul>
                {tracks.map((t) => (
                  <li key={t.k} className="jukebox-track">
                    <span className="font-mono text-xs text-brand-cyan tabular-nums">{t.no}</span>
                    <span className="jukebox-track-dot" aria-hidden />
                    <span className="flex-1 font-sans text-sm font-medium text-foreground">
                      {t.title}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {t.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chrome speaker grille */}
            <div className="jukebox-grille" aria-hidden>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={`grille-${i}`} />
              ))}
            </div>
          </div>

          {/* Feet */}
          <div className="jukebox-feet" aria-hidden>
            <span />
            <span />
          </div>
        </m.section>
      </div>
    </main>
  )
}
