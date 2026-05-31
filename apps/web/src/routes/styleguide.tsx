import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from '#/components/motion/reveal'

export const Route = createFileRoute('/styleguide')({
  head: () => ({ meta: [{ title: 'Style Guide — Pawan Danani' }] }),
  component: StyleGuide,
})

const buttons = [
  ['Primary', 'bg-primary text-primary-foreground'],
  ['Secondary', 'bg-secondary text-secondary-foreground'],
  ['Outline', 'border border-border bg-transparent hover:bg-accent'],
  ['Ghost', 'bg-transparent hover:bg-accent'],
  ['Destructive', 'bg-destructive text-destructive-foreground'],
] as const

const swatches = [
  ['background', 'bg-background'],
  ['card', 'bg-card'],
  ['primary', 'bg-primary'],
  ['secondary', 'bg-secondary'],
  ['muted', 'bg-muted'],
  ['accent', 'bg-accent'],
  ['brand', 'bg-brand'],
  ['brand-cyan', 'bg-brand-cyan'],
  ['brand-amber', 'bg-brand-amber'],
  ['destructive', 'bg-destructive'],
] as const

const tags = ['Spring Boot 4', 'Postgres', 'Redis', 'Kafka', 'TanStack', 'TypeScript']

function StyleGuide() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <a href="/" className="font-mono text-sm text-brand-cyan hover:underline">
          ← back home
        </a>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Style Guide</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Flip kits with the switcher (bottom-right) to preview the whole system
          in each aesthetic. Everything below is driven by design tokens.
        </p>
      </header>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-3">
          <h1 className="font-display text-5xl font-bold tracking-tight">Display H1</h1>
          <h2 className="font-display text-3xl font-bold">Display H2</h2>
          <h3 className="font-display text-2xl font-semibold">Display H3</h3>
          <p className="max-w-2xl text-lg">
            Body copy in the sans family — the quick brown fox jumps over the lazy
            dog while shipping resilient distributed systems.
          </p>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand-cyan">
            // mono accent label
          </p>
          <p className="font-display text-4xl font-bold">
            <span className="bg-gradient-to-r from-brand via-brand-cyan to-brand bg-clip-text text-transparent">
              Gradient headline
            </span>
          </p>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          {buttons.map(([label, cls]) => (
            <button
              key={label}
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-90 ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Tags */}
      <Section title="Tags / Badges">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </Section>

      {/* Surfaces */}
      <Section title="Cards / Surfaces">
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="surface p-6">
              <h3 className="font-display text-lg font-semibold">Surface {n}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Glass vs flat, radius, border weight, and shadow all shift per kit.
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Form */}
      <Section title="Inputs">
        <div className="flex max-w-md flex-col gap-3">
          <input
            type="text"
            placeholder="you@example.com"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
          <textarea
            rows={3}
            placeholder="Say hello…"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>
      </Section>

      {/* Palette */}
      <Section title="Palette">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([name, cls]) => (
            <div key={name}>
              <div className={`h-16 rounded-md border border-border ${cls}`} />
              <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{name}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="border-t border-border py-10">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </Reveal>
  )
}
