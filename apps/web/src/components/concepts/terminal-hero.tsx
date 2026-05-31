import { m } from 'motion/react'

/** Terminal — a faux shell window; monospace, prompt lines, blinking cursor. */
const lines = [
  { cmd: 'whoami', out: 'pawan danani — software engineer' },
  {
    cmd: 'cat bio.txt',
    out: 'Builds resilient distributed systems with Spring Boot, Postgres, Redis & Kafka.',
  },
  {
    cmd: 'ls ./projects',
    out: 'url-shortener/   rate-limiter/   event-pipeline/   dns-resolver/',
  },
]

export function TerminalHero() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-20">
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="surface w-full max-w-2xl overflow-hidden font-mono text-sm"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-3 rounded-full bg-destructive" />
          <span className="size-3 rounded-full bg-brand-amber" />
          <span className="size-3 rounded-full bg-primary" />
          <span className="ml-3 text-xs text-muted-foreground">pawan@portfolio — zsh</span>
        </div>
        <div className="space-y-3 p-5 leading-relaxed">
          {lines.map((l) => (
            <div key={l.cmd}>
              <p>
                <span className="text-primary">➜</span>{' '}
                <span className="text-brand-cyan">~</span> {l.cmd}
              </p>
              <p className="text-muted-foreground">{l.out}</p>
            </div>
          ))}
          <p>
            <span className="text-primary">➜</span>{' '}
            <span className="text-brand-cyan">~</span> ./contact --open
            <span className="term-cursor ml-1 align-middle" />
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <a href="#" className="border border-border px-4 py-2 transition hover:bg-accent">
              [ view projects ]
            </a>
            <a href="#" className="border border-border px-4 py-2 transition hover:bg-accent">
              [ about ]
            </a>
          </div>
        </div>
      </m.div>
    </main>
  )
}
