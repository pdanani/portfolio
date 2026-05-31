import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Neo-Noir Neon — a rainy neon night city; moody dark cyberpunk. */
export function NoirNeonHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  // City skyline silhouettes: [leftPct, widthPct, heightPct, windows]
  const buildings: Array<[number, number, number, number]> = [
    [-2, 9, 34, 4],
    [8, 7, 52, 6],
    [16, 11, 40, 5],
    [28, 6, 66, 7],
    [35, 9, 46, 6],
    [45, 8, 58, 6],
    [54, 12, 38, 5],
    [67, 7, 64, 7],
    [75, 10, 48, 6],
    [86, 9, 56, 6],
    [96, 8, 42, 5],
  ]

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background">
      {/* ---------- Backdrop ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="noirneon-sky absolute inset-0" />
        <div className="noirneon-haze absolute inset-x-0 bottom-0 h-[55%]" />

        {/* Distant neon sign glows */}
        <div className="noirneon-sign noirneon-sign-a absolute left-[12%] top-[20%]">
          <span className="font-display text-lg font-bold tracking-[0.3em]">夜 NOIR</span>
        </div>
        <div className="noirneon-sign noirneon-sign-b absolute right-[10%] top-[30%]">
          <span className="font-mono text-sm tracking-[0.35em]">OPEN · 24H</span>
        </div>
        <div className="noirneon-ring noirneon-ring-c absolute right-[18%] top-[14%]" />

        {/* City skyline */}
        <div className="absolute inset-x-0 bottom-[26%] h-[60%]">
          {buildings.map(([left, w, h, win], i) => (
            <div
              key={`b-${i}`}
              className="noirneon-building absolute bottom-0"
              style={{ left: `${left}%`, width: `${w}%`, height: `${h}%` }}
            >
              {Array.from({ length: win }).map((_, j) => (
                <span
                  key={`w-${i}-${j}`}
                  className={`noirneon-window ${j % 4 === 0 ? 'noirneon-window-cyan' : ''} ${j % 5 === 0 ? 'noirneon-window-off' : ''}`}
                  style={{
                    left: `${18 + (j % 3) * 30}%`,
                    bottom: `${12 + Math.floor(j / 3) * 22}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Rain */}
        <div className="noirneon-rain absolute inset-0" />

        {/* Wet-street reflection band */}
        <div className="noirneon-street absolute inset-x-0 bottom-0 h-[26%]">
          <div className="noirneon-reflect noirneon-reflect-a absolute bottom-[30%] left-[12%]" />
          <div className="noirneon-reflect noirneon-reflect-b absolute bottom-[36%] right-[10%]" />
          <div className="noirneon-reflect noirneon-reflect-c absolute bottom-[44%] left-[44%]" />
          <div className="noirneon-streetline absolute inset-x-0 top-0 h-px" />
        </div>

        {/* Fog + vignette */}
        <div className="noirneon-vignette absolute inset-0" />
      </div>

      {/* ---------- Content ---------- */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-24">
        <m.p
          {...rise(0.12)}
          className="font-mono text-[0.7rem] uppercase tracking-[0.45em] text-brand-cyan"
        >
          <span className="noirneon-dot mr-2 inline-block size-1.5 rounded-full align-middle" />
          Software Engineer · Night Shift
        </m.p>

        <m.h1
          {...rise(0.22)}
          className="noirneon-neon mt-6 font-display text-6xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-8xl"
        >
          Pawan
          <br />
          Danani
        </m.h1>

        <m.p
          {...rise(0.4)}
          className="mt-7 max-w-md font-sans text-base leading-relaxed text-foreground/75 sm:text-lg"
        >
          Building quiet systems in a loud, rain-slick city — where every
          request finds its way home before the neon dims.
        </m.p>

        <m.div {...rise(0.56)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="noirneon-btn noirneon-btn-primary rounded-[var(--radius)] px-7 py-3 font-display text-xs font-semibold uppercase tracking-[0.2em]"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="noirneon-btn noirneon-btn-ghost rounded-[var(--radius)] px-7 py-3 font-display text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Get in touch
          </a>
        </m.div>
      </div>
    </main>
  )
}
