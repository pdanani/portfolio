/** Editorial — magazine masthead: serif display, masthead rule, two-column lede with drop cap. */
export function EditorialHero() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>Issue 01 — MMXXVI</span>
        <span>Portfolio</span>
      </div>

      <h1 className="mt-10 font-display text-6xl font-semibold leading-[0.92] sm:text-8xl">
        Pawan
        <br />
        Danani
      </h1>
      <p className="mt-4 font-display text-2xl italic text-muted-foreground">
        Software engineer &amp; systems tinkerer
      </p>

      <div className="dropcap mt-10 columns-1 gap-10 text-lg leading-relaxed sm:columns-2">
        <p>
          Builds resilient production software across React and Node — point-of-sale
          systems, payments, and AWS pipelines shipped at scale. Lately, exploring
          distributed systems the only way that sticks: by building them. Each lab
          project pairs a Spring Boot service with Postgres, Redis, or Kafka, a written
          breakdown, and a live, deployable demo you can actually poke at. Equal parts
          craft and curiosity, documented in full.
        </p>
      </div>

      <hr className="my-10 border-border" />

      <nav className="flex gap-8 font-display text-lg">
        <a href="#" className="transition hover:text-primary">
          Projects
        </a>
        <a href="#" className="transition hover:text-primary">
          About
        </a>
        <a href="#" className="transition hover:text-primary">
          Contact
        </a>
      </nav>
    </main>
  )
}
