import { useState } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Neon Sign — a realistic glowing neon bar sign (glass tubes + buzz/flicker) on
 * a dark brick wall. Token-driven, so Neon Green and Neon Red both use it.
 * The font picker is temporary exploration UI — once a font is chosen it gets
 * baked into the kit's --ff-display and the picker removed.
 */
const NEON_FONTS = [
  { id: 'Monoton', label: 'Monoton' },
  { id: 'Pacifico', label: 'Pacifico' },
  { id: 'Kaushan Script', label: 'Kaushan' },
  { id: 'Yellowtail', label: 'Yellowtail' },
]

export function NeonSignHero() {
  const reduce = useReducedMotion()
  const [font, setFont] = useState('Monoton')
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="neonsign-wall relative isolate grid min-h-screen place-items-center overflow-hidden px-6">
      <div aria-hidden className="neonsign-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="neonsign-floor pointer-events-none absolute inset-x-0 bottom-0" />

      <div className="relative w-full max-w-3xl text-center">
        <m.p
          {...rise(0)}
          className="neonsign-tube-accent font-mono text-[0.7rem] uppercase tracking-[0.45em] sm:text-xs"
        >
          ★ open · software engineer ★
        </m.p>

        <m.h1
          {...rise(0.12)}
          style={{ fontFamily: `'${font}', cursive` }}
          className="neonsign-tube neonsign-flicker mt-7 text-6xl leading-[1.08] sm:text-7xl"
        >
          Pawan
          <span className="block">Danani</span>
        </m.h1>

        <m.p
          {...rise(0.24)}
          className="mx-auto mt-9 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Building resilient, distributed systems — Spring Boot, Postgres, Redis
          &amp; Kafka.
        </m.p>

        <m.div {...rise(0.34)} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="neonsign-btn px-6 py-3 font-mono text-[0.7rem] uppercase tracking-wider"
          >
            View projects
          </a>
          <a
            href="#"
            className="neonsign-btn neonsign-btn-accent px-6 py-3 font-mono text-[0.7rem] uppercase tracking-wider"
          >
            About
          </a>
        </m.div>

        {/* Temporary: try the candidate neon fonts */}
        <m.div {...rise(0.44)} className="mt-12 flex flex-wrap justify-center gap-2">
          {NEON_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFont(f.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                font === f.id
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </m.div>
      </div>
    </main>
  )
}
