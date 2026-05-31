import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/** Neo-Noir — chiaroscuro black & white: tungsten key-light, venetian-blind
 *  shadows, heavy vignette and film grain under dramatic Fraunces display. */
export function NoirHero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      {/* Cinematic lighting stack */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.01 : 1.4, ease: EASE }}
          className="noir-keylight noir-glint absolute inset-0"
        />
        <div className="noir-blinds absolute inset-0" />
        <div className="noir-vignette absolute inset-0" />
        <div className="noir-grain absolute inset-0" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 sm:px-10">
        <m.p
          {...rise(0.1)}
          className="font-mono text-[0.7rem] uppercase tracking-[0.55em] text-muted-foreground"
        >
          Software Engineer
        </m.p>

        <m.h1
          {...rise(0.2)}
          className="noir-title mt-7 font-display text-6xl font-light leading-[0.92] tracking-tight sm:text-8xl lg:text-9xl"
        >
          Pawan
          <br />
          <span className="font-normal italic">Danani</span>
        </m.h1>

        <m.div
          {...rise(0.3)}
          aria-hidden
          className="noir-rule mt-8 h-px w-40 bg-primary sm:w-56"
        />

        <m.p
          {...rise(0.42)}
          className="mt-9 max-w-xl font-sans text-base leading-relaxed text-foreground/80 sm:text-lg"
        >
          In a city of dim terminals and longer nights, one engineer builds the
          systems that keep the lights on. Distributed backends, sharp edges,
          <span className="text-foreground"> no loose ends</span>.
        </m.p>

        <m.div {...rise(0.56)} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="bg-foreground px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-background transition hover:opacity-85"
          >
            View projects
          </a>
          <a
            href="#"
            className="border border-border px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition hover:bg-accent"
          >
            The dossier
          </a>
        </m.div>
      </div>
    </main>
  )
}
