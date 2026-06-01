import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function JukeboxDeluxeHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.65, ease: EASE, delay },
  })
  const run = reduce ? ('paused' as const) : ('running' as const)

  // Title strips — the stack + nav, as Wurlitzer song cards.
  const strips = [
    { k: 'a1', code: 'A1', title: 'Spring Boot', sub: 'framework', sel: false, href: undefined },
    { k: 'a2', code: 'A2', title: 'Postgres', sub: 'datastore', sel: false, href: undefined },
    { k: 'b1', code: 'B1', title: 'Redis', sub: 'cache', sel: false, href: undefined },
    { k: 'b2', code: 'B2', title: 'Kafka', sub: 'streaming', sel: false, href: undefined },
    { k: 'a3', code: 'A3', title: 'PROJECTS', sub: 'see work', sel: true, href: '#' },
    { k: 'b3', code: 'B3', title: 'ABOUT', sub: 'the story', sel: false, href: '#' },
    { k: 'c1', code: 'C1', title: 'CONTACT', sub: 'say hi', sel: false, href: '#' },
    { k: 'c2', code: 'C2', title: 'TypeScript', sub: 'language', sel: false, href: undefined },
  ]

  const bubbles = [
    { k: 'u1', l: '24%', d: '0s', s: '3.6s', w: 7 },
    { k: 'u2', l: '58%', d: '0.9s', s: '4.4s', w: 5 },
    { k: 'u3', l: '40%', d: '1.8s', s: '3.1s', w: 9 },
    { k: 'u4', l: '70%', d: '2.6s', s: '4.9s', w: 6 },
    { k: 'u5', l: '50%', d: '1.2s', s: '3.9s', w: 4 },
  ]
  const eq = [
    { k: 'e1', h: 42, d: '0s' },
    { k: 'e2', h: 78, d: '0.18s' },
    { k: 'e3', h: 56, d: '0.36s' },
    { k: 'e4', h: 92, d: '0.1s' },
    { k: 'e5', h: 48, d: '0.5s' },
  ]
  const letters = ['A', 'B', 'C', 'D', 'E']
  const numbers = ['1', '2', '3', '4', '5']

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Diner ambiance */}
      <div aria-hidden className="jukebox2-room pointer-events-none absolute inset-0 -z-10">
        <div className="jukebox2-floor" />
        <div className="jukebox2-glow" />
        <div className="jukebox2-vignette" />
      </div>

      <m.section
        {...rise(0.12)}
        className="jukebox2-cabinet relative w-full max-w-2xl"
        aria-label="Pawan Danani — jukebox portfolio"
      >
        {/* Bubble tubes flanking the whole cabinet */}
        {(['left', 'right'] as const).map((side) => (
          <div key={`tube-${side}`} className={`jukebox2-tube jukebox2-tube--${side}`} aria-hidden>
            <span className="jukebox2-tube-glow" style={{ animationPlayState: run }} />
            {bubbles.map((b) => (
              <i
                key={`${side}-${b.k}`}
                className="jukebox2-bubble"
                style={{
                  left: b.l,
                  width: b.w,
                  height: b.w,
                  animationDelay: b.d,
                  animationDuration: b.s,
                  animationPlayState: run,
                }}
              />
            ))}
          </div>
        ))}

        {/* ---- Domed arch top ---- */}
        <div className="jukebox2-dome">
          <div className="jukebox2-arc-neon jukebox2-arc-neon--mag" style={{ animationPlayState: run }} />
          <div className="jukebox2-arc-neon jukebox2-arc-neon--teal" style={{ animationPlayState: run }} />
          <div className="jukebox2-arc-chrome" />
          <div className="jukebox2-arc-shine" aria-hidden />

          {/* NOW PLAYING marquee */}
          <div className="jukebox2-display">
            <div className="jukebox2-display-head">
              <span className="jukebox2-play" aria-hidden style={{ animationPlayState: run }}>
                {'▶'}
              </span>
              <span className="font-mono text-[9px] tracking-[0.34em] text-brand-amber/90 uppercase">
                Now Playing
              </span>
              <span className="jukebox2-eq" aria-hidden>
                {eq.map((b) => (
                  <i
                    key={b.k}
                    style={{ height: `${b.h}%`, animationDelay: b.d, animationPlayState: run }}
                  />
                ))}
              </span>
            </div>
            <p className="jukebox2-name font-display leading-none">Pawan Danani</p>
            <span className="font-sans text-[10px] font-medium tracking-[0.3em] text-brand-cyan uppercase sm:text-[11px]">
              Software Engineer
            </span>
          </div>
        </div>

        {/* ---- Cabinet body ---- */}
        <div className="jukebox2-body">
          {/* Selection mechanism — title strips */}
          <div className="jukebox2-mech">
            <div className="jukebox2-mech-glass" aria-hidden />
            <div className="jukebox2-strips" role="list">
              {strips.map((s) => {
                const inner = (
                  <>
                    <span className="jukebox2-strip-code font-mono">{s.code}</span>
                    <span className="jukebox2-strip-body">
                      <span className="jukebox2-strip-title font-sans">{s.title}</span>
                      <span className="jukebox2-strip-sub font-mono">{s.sub}</span>
                    </span>
                  </>
                )
                const cls = `jukebox2-strip${s.sel ? ' jukebox2-strip--sel' : ''}`
                return s.href ? (
                  <a key={s.k} href={s.href} className={cls} role="listitem">
                    {inner}
                  </a>
                ) : (
                  <div key={s.k} className={cls} role="listitem">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Turntable + tonearm */}
          <div className="jukebox2-deck">
            <div className="jukebox2-platter" aria-hidden>
              <div className="jukebox2-record" style={{ animationPlayState: run }}>
                <span className="jukebox2-record-label" />
                <span className="jukebox2-spindle" />
              </div>
            </div>
            <div className="jukebox2-tonearm" aria-hidden>
              <span className="jukebox2-tonearm-pivot" />
              <span className="jukebox2-tonearm-head" />
            </div>
          </div>

          {/* Keypad */}
          <div className="jukebox2-keypad" aria-hidden>
            <div className="jukebox2-keyrow">
              {letters.map((l) => (
                <span key={`L${l}`} className="jukebox2-key jukebox2-key--letter">
                  {l}
                </span>
              ))}
            </div>
            <div className="jukebox2-keyrow">
              {numbers.map((n) => (
                <span key={`N${n}`} className="jukebox2-key jukebox2-key--num">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Speaker grille + pilasters */}
          <div className="jukebox2-lower">
            <span className="jukebox2-pilaster" style={{ animationPlayState: run }} aria-hidden />
            <div className="jukebox2-grille" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={`bar-${i}`} />
              ))}
            </div>
            <span className="jukebox2-pilaster" style={{ animationPlayState: run }} aria-hidden />
          </div>
        </div>

        <div className="jukebox2-feet" aria-hidden>
          <span />
          <span />
        </div>
      </m.section>
    </main>
  )
}
