import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Waves 8-Bit — a pure-CSS pixel-art ocean: dithered sky, a stepped pixel sun,
 * a tiny pixel boat, and four stacked bands of chunky scrolling waves.
 */
const STACK = ['SPRING BOOT', 'POSTGRES', 'REDIS', 'KAFKA'] as const

export function Waves8BitHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* ---- Pixel-art ocean (original CSS art, behind content) ---- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="waves8bit-sky" />
        <div className="waves8bit-dither" />
        <div className="waves8bit-sun" />
        <div className="waves8bit-cloud" style={{ top: '17%', left: '11%' }} />
        <div
          className="waves8bit-cloud waves8bit-cloud--sm"
          style={{ top: '28%', right: '16%' }}
        />
        <div className="waves8bit-boat" />

        {/* Stacked wave bands — far (slow) to near (fast) */}
        <div className="waves8bit-sea">
          <div className="waves8bit-wave waves8bit-wave--1" />
          <div className="waves8bit-wave waves8bit-wave--2" />
          <div className="waves8bit-wave waves8bit-wave--3" />
          <div className="waves8bit-wave waves8bit-wave--4" />
        </div>
      </div>

      {/* ---- Overlay content ---- */}
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <m.p
          {...rise(0.08)}
          className="font-display text-[0.55rem] uppercase leading-relaxed tracking-[0.18em] sm:text-[0.7rem]"
        >
          <span className="waves8bit-eyebrow inline-block px-3 py-2 text-accent-foreground">
            PLAYER 1 {'·'} SOFTWARE ENGINEER
          </span>
        </m.p>

        <m.div {...rise(0.16)} className="waves8bit-sign mt-7 inline-block self-start p-5 sm:p-7">
          <h1 className="waves8bit-title font-display text-2xl uppercase leading-[1.55] sm:text-4xl sm:leading-[1.5]">
            Pawan
            <br />
            Danani
          </h1>
        </m.div>

        <m.p
          {...rise(0.28)}
          className="waves8bit-body mt-7 max-w-xl px-3 py-2 font-sans text-base leading-relaxed text-foreground sm:text-lg"
        >
          Charting resilient, distributed systems across choppy seas — Spring Boot,
          Postgres, Redis, and Kafka lashed together to stay afloat through every
          storm and failover.
        </m.p>

        <m.ul {...rise(0.36)} className="mt-6 flex flex-wrap gap-2">
          {STACK.map((s) => (
            <li
              key={s}
              className="waves8bit-chip px-3 py-1.5 font-display text-[0.5rem] uppercase tracking-wider text-secondary-foreground"
            >
              {s}
            </li>
          ))}
        </m.ul>

        <m.div {...rise(0.46)} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="waves8bit-btn bg-primary px-6 py-3 font-display text-[0.55rem] uppercase tracking-wider text-primary-foreground sm:text-[0.6rem]"
          >
            View projects
          </a>
          <a
            href="#"
            className="waves8bit-btn waves8bit-btn--ghost px-6 py-3 font-display text-[0.55rem] uppercase tracking-wider text-secondary-foreground sm:text-[0.6rem]"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
