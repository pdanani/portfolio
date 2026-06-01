import { useState, type CSSProperties } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Neon Sign — a realistic glowing neon bar sign (glass tubes + buzz/flicker) on
 * a dark brick wall. The tube COLOR and the display FONT are picked live via the
 * on-sign controls (the wall stays neutral; only --primary/--brand-cyan are
 * overridden). Picker UI is temporary exploration scaffolding.
 */
const NEON_COLORS = [
  { id: 'green', label: 'Green', primary: 'oklch(0.84 0.22 145)', accent: 'oklch(0.86 0.16 168)' },
  { id: 'red', label: 'Red', primary: 'oklch(0.63 0.25 25)', accent: 'oklch(0.72 0.2 12)' },
  { id: 'blue', label: 'Blue', primary: 'oklch(0.66 0.2 250)', accent: 'oklch(0.78 0.15 228)' },
  { id: 'purple', label: 'Purple', primary: 'oklch(0.62 0.26 300)', accent: 'oklch(0.74 0.18 290)' },
]

const NEON_FONTS = [
  { id: 'Monoton', label: 'Monoton' },
  { id: 'Pacifico', label: 'Pacifico' },
  { id: 'Kaushan Script', label: 'Kaushan' },
  { id: 'Yellowtail', label: 'Yellowtail' },
]

export function NeonSignHero() {
  const reduce = useReducedMotion()
  const [colorId, setColorId] = useState('green')
  const [font, setFont] = useState('Monoton')
  const color = NEON_COLORS.find((c) => c.id === colorId) ?? NEON_COLORS[0]

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  // Override the neon tube colors live; the wall/background tokens are untouched.
  const wallStyle = {
    '--primary': color.primary,
    '--brand-cyan': color.accent,
  } as unknown as CSSProperties

  return (
    <main
      style={wallStyle}
      className="neonsign-wall relative isolate grid min-h-screen place-items-center overflow-hidden px-6"
    >
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

        {/* Temporary: pick the tube color + display font */}
        <m.div {...rise(0.44)} className="mt-12 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {NEON_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorId(c.id)}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                  colorId === c.id
                    ? 'border-foreground text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: c.primary, boxShadow: `0 0 8px ${c.primary}` }}
                />
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        </m.div>
      </div>
    </main>
  )
}
