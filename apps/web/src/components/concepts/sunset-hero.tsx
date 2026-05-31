import { m } from 'motion/react'

/** Sunset — warm split layout: copy on the left, a glowing gradient orb on the right. */
export function SunsetHero() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
          software engineer
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
          Hey, I'm <span className="text-primary">Pawan</span> — I build warm,
          resilient systems.
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          Production software by day, distributed-systems labs by night — Spring
          Boot, Postgres, Redis, and Kafka.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#"
            className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            View projects
          </a>
          <a
            href="#"
            className="rounded-full border border-border px-6 py-3 font-medium transition hover:bg-accent"
          >
            About me
          </a>
        </div>
      </div>

      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto aspect-square w-full max-w-md"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, var(--brand-amber), var(--primary) 45%, var(--brand-cyan) 92%)',
            filter: 'blur(6px)',
          }}
        />
        <div className="surface absolute inset-10 rounded-full" />
      </m.div>
    </main>
  )
}
