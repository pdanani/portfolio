import { m } from 'motion/react'

/** Cyber Neon — HUD framing: corner brackets, scanlines, neon glow, grid floor. */
export function CyberHero() {
  return (
    <main className="scanlines relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="cyber-grid pointer-events-none absolute inset-x-0 bottom-0 h-1/2" />

      <span className="pointer-events-none absolute left-6 top-6 size-10 border-l-2 border-t-2 border-primary" />
      <span className="pointer-events-none absolute right-6 top-6 size-10 border-r-2 border-t-2 border-primary" />
      <span className="pointer-events-none absolute bottom-6 left-6 size-10 border-b-2 border-l-2 border-primary" />
      <span className="pointer-events-none absolute bottom-6 right-6 size-10 border-b-2 border-r-2 border-primary" />

      <div className="relative text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-brand-cyan">
          sys::online — lat 12ms — node ok
        </p>
        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="neon mt-5 font-display text-6xl font-bold uppercase tracking-tight sm:text-8xl"
        >
          Pawan Danani
        </m.h1>
        <p className="mt-4 font-mono text-lg text-muted-foreground">
          // software engineer · distributed systems
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#"
            className="rounded-md bg-primary px-6 py-3 font-mono text-sm uppercase text-primary-foreground"
            style={{ boxShadow: '0 0 24px var(--primary)' }}
          >
            view_projects
          </a>
          <a
            href="#"
            className="rounded-md border border-primary px-6 py-3 font-mono text-sm uppercase text-primary transition hover:bg-accent"
          >
            about
          </a>
        </div>
      </div>
    </main>
  )
}
