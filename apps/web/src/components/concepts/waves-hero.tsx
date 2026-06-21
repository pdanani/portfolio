import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Waves — a calm, clean ocean concept. Centered copy floats above a few
 * layered SVG wave bands that drift horizontally at different speeds for a
 * gentle parallax. Smooth/realistic rather than 8-bit, to stay minimal.
 */
export function WavesHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  const stack = ['Spring Boot', 'Postgres', 'Redis', 'Kafka']
  const nav = ['Projects', 'About', 'Contact']

  // Two identical periods across the viewBox so a -50% drift loops seamlessly.
  const wave =
    'M0 60 C 240 20 480 20 720 60 C 960 100 1200 100 1440 60 ' +
    'C 1680 20 1920 20 2160 60 C 2400 100 2640 100 2880 60 ' +
    'L2880 200 L0 200 Z'

  return (
    <main className="waves-room relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      {/* Drifting wave bands, pinned to the bottom */}
      <div aria-hidden className="waves-sea pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <svg className="waves-band waves-band-3" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <path d={wave} />
        </svg>
        <svg className="waves-band waves-band-2" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <path d={wave} />
        </svg>
        <svg className="waves-band waves-band-1" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <path d={wave} />
        </svg>
      </div>

      <section className="relative w-full max-w-2xl text-center">
        <m.p
          {...rise(0)}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.32em] text-primary"
        >
          <span className="waves-dot" aria-hidden />
          Software Engineer
        </m.p>

        <m.h1
          {...rise(0.1)}
          className="font-display mt-5 text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl"
        >
          Pawan Danani
        </m.h1>

        <m.p
          {...rise(0.2)}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          I build resilient, distributed systems — fault-tolerant services and
          event pipelines that stay calm under load.
        </m.p>

        <m.ul {...rise(0.3)} className="mt-7 flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <li key={tech} className="waves-chip">
              {tech}
            </li>
          ))}
        </m.ul>

        <m.nav {...rise(0.4)} className="mt-9 flex flex-wrap items-center justify-center gap-3" aria-label="Sections">
          <a href="#" className="waves-btn waves-btn-primary">
            View projects
          </a>
          {nav.slice(1).map((label) => (
            <a key={label} href="#" className="waves-btn">
              {label}
            </a>
          ))}
        </m.nav>
      </section>
    </main>
  )
}
