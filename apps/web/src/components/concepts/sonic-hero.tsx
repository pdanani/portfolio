import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

export function SonicHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const hud = [
    { k: 'score', label: 'SCORE', value: '0042' },
    { k: 'rings', label: 'RINGS', value: 'x32' },
    { k: 'time', label: 'TIME', value: '1:09' },
  ]

  const rings = [
    { k: 'r1', top: '24%', left: '12%', spin: true, scale: 1 },
    { k: 'r2', top: '40%', left: '20%', spin: false, scale: 0.78 },
    { k: 'r3', top: '32%', right: '34%', spin: true, scale: 0.92 },
    { k: 'r4', bottom: '32%', left: '8%', spin: false, scale: 0.66 },
    { k: 'r5', top: '18%', right: '20%', spin: false, scale: 0.7 },
  ]

  const streaks = [
    { k: 's1', top: '30%', left: '4%', width: 120, delay: 0 },
    { k: 's2', top: '52%', left: '2%', width: 90, delay: 0.4 },
    { k: 's3', top: '64%', left: '6%', width: 150, delay: 0.8 },
    { k: 's4', top: '44%', left: '0%', width: 70, delay: 1.1 },
  ]

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Sky + scenery (original CSS art, behind content) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="sonic-sky" />

        {/* loop-the-loop arc motif, off to one side */}
        <div
          className="sonic-loop"
          style={{ top: '-14%', right: '-10%', width: '52vw', height: '52vw', maxWidth: 560, maxHeight: 560 }}
        />

        {/* clouds */}
        <div className="sonic-cloud" style={{ top: '16%', left: '30%', width: 70, height: 32 }} />
        <div className="sonic-cloud" style={{ top: '12%', right: '10%', width: 54, height: 26 }} />

        {/* speed streaks */}
        {streaks.map((s) => (
          <div
            key={s.k}
            className="sonic-streak"
            style={{
              top: s.top,
              left: s.left,
              width: s.width,
              animationDelay: `${s.delay}s`,
              animationPlayState: reduce ? 'paused' : 'running',
            }}
          />
        ))}

        {/* gold rings */}
        {rings.map((r) => (
          <div
            key={r.k}
            className="absolute"
            style={{ top: r.top, bottom: r.bottom, left: r.left, right: r.right }}
          >
            <div
              className={r.spin && !reduce ? 'sonic-ring sonic-ring--spin' : 'sonic-ring'}
              style={{ transform: `scale(${r.scale})` }}
            />
          </div>
        ))}

        {/* grass lip + checkerboard ground */}
        <div className="sonic-grass" />
        <div className="sonic-ground" />
      </div>

      {/* HUD bar */}
      <m.div
        {...rise(0)}
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 pt-8 font-display text-foreground"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
          Speed Zone
        </span>
        <div className="flex gap-4 text-[9px] font-extrabold uppercase tracking-wider sm:text-[11px]">
          {hud.map((s) => (
            <span key={s.k} className="text-foreground/80">
              {s.label} <span className="text-brand-amber">{s.value}</span>
            </span>
          ))}
        </div>
      </m.div>

      {/* Hero content */}
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl flex-col justify-center px-6 pb-36">
        <m.p
          {...rise(0.08)}
          className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground sm:text-xs"
        >
          <span className="sonic-badge bg-primary px-2.5 py-1.5">Software Engineer</span>
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="sonic-title mt-8 font-display text-5xl font-black uppercase sm:text-7xl"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-10 max-w-xl font-sans text-base font-medium leading-relaxed text-foreground sm:text-lg"
        >
          Resilient distributed systems, built fast. Spring Boot, Postgres, Redis,
          and Kafka — wired together, battle-tested, and shipped at full speed.
        </m.p>

        <m.div {...rise(0.4)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="sonic-btn bg-primary px-6 py-3 font-display text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground sm:text-xs"
          >
            View projects
            <span aria-hidden className="text-brand-amber">{'»'}</span>
          </a>
          <a
            href="#"
            className="sonic-btn bg-accent px-6 py-3 font-display text-[11px] font-extrabold uppercase tracking-wider text-accent-foreground sm:text-xs"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
