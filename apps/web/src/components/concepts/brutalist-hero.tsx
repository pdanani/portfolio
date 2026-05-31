/** Brutalist — oversized stacked type, marquee, hard-bordered blocks. */
const marqueeTags = [
  'SPRING BOOT',
  'POSTGRES',
  'REDIS',
  'KAFKA',
  'REACT',
  'NODE',
  'TYPESCRIPT',
  'AWS',
]

export function BrutalistHero() {
  return (
    <main className="min-h-screen px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em]">
        Pawan Danani / Software Engineer / 2026
      </p>

      <h1 className="mt-6 font-display text-[clamp(3rem,14vw,11rem)] font-bold uppercase leading-[0.85] tracking-tighter">
        Builds
        <br />
        <span className="bg-primary px-2 text-primary-foreground">resilient</span>
        <br />
        systems
      </h1>

      <div className="marquee mt-8 border-y-2 border-border py-2">
        <div className="marquee__track font-mono text-sm font-bold uppercase">
          {[...marqueeTags, ...marqueeTags].map((t, i) => (
            <span key={`${t}-${i}`} className="mx-4">
              {t} ✦
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a href="#" className="surface px-6 py-3 font-bold uppercase">
          View Projects →
        </a>
        <a
          href="#"
          className="border-2 border-border px-6 py-3 font-bold uppercase transition hover:bg-accent"
        >
          About
        </a>
      </div>
    </main>
  )
}
