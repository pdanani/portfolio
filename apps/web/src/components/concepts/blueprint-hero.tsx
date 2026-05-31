import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

const stack = ['SPRING BOOT', 'POSTGRES', 'REDIS', 'KAFKA']

export function BlueprintHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, ease: EASE, delay },
  })

  return (
    <main className="relative min-h-screen overflow-hidden font-sans">
      {/* drafting surface */}
      <div className="blueprint-grid pointer-events-none absolute inset-0" />

      {/* draftsman markings */}
      <span className="blueprint-crosshair left-[12%] top-[18%]" aria-hidden />
      <span className="blueprint-crosshair right-[14%] bottom-[22%]" aria-hidden />
      <span className="blueprint-dim blueprint-dim--h left-[12%] top-[12%] w-[26%]" aria-hidden />
      <span className="blueprint-dim blueprint-dim--v left-[7%] top-[18%] h-[42%]" aria-hidden />
      <p className="pointer-events-none absolute left-[12%] top-[8%] font-mono text-[10px] uppercase tracking-[0.3em] text-primary/70">
        1280.00 mm
      </p>
      <p className="pointer-events-none absolute left-[3.5%] top-[37%] -rotate-90 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/70">
        scale 1:1
      </p>

      {/* content */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 sm:px-10">
        <m.p
          {...rise(0)}
          className="font-mono text-xs uppercase tracking-[0.35em] text-brand-cyan"
        >
          DWG-2026 // backend &amp; distributed systems engineer
        </m.p>

        <m.h1
          {...rise(0.08)}
          className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl"
        >
          Pawan Danani
        </m.h1>

        <m.p
          {...rise(0.16)}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Drafting resilient, distributed systems through hands-on lab builds —
          event pipelines and fault-tolerant services on Spring Boot, Postgres,
          Redis, and Kafka.
        </m.p>

        <m.ul {...rise(0.24)} className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
          {stack.map((s) => (
            <li
              key={s}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80 before:mr-2 before:text-primary before:content-['+']"
            >
              {s}
            </li>
          ))}
        </m.ul>

        <m.div {...rise(0.32)} className="mt-9 flex flex-wrap gap-4">
          <a
            href="#"
            className="bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
            style={{ boxShadow: '0 0 28px oklch(0.78 0.13 215 / 0.35)' }}
          >
            View projects
          </a>
          <a
            href="#"
            className="border border-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary transition hover:bg-accent"
          >
            About
          </a>
        </m.div>
      </div>

      {/* title block — engineering drawing convention */}
      <m.aside
        {...rise(0.4)}
        className="surface absolute bottom-6 right-6 hidden w-72 sm:block"
        aria-label="drawing title block"
      >
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <Cell label="DRAWN BY" value="P. DANANI" wide />
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <Cell label="REV" value="04" />
          <Cell label="SHEET" value="01/01" />
          <Cell label="DATE" value="2026.05" />
        </div>
      </m.aside>
    </main>
  )
}

function Cell({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={`px-3 py-2 ${wide ? 'col-span-3' : ''}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm uppercase text-foreground">{value}</p>
    </div>
  )
}
