import { Reveal } from '#/components/motion/reveal'
import { Section, SectionHeading } from './section'

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeading number="01" title="About" />

      <div className="flex flex-col items-start gap-10 sm:flex-row sm:gap-14">
        <Reveal className="shrink-0">
          <figure className="w-56 -rotate-1 transition-transform duration-500 hover:rotate-0 sm:w-64">
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-[0_18px_50px_oklch(0.72_0.18_50_/_0.16)] ring-1 ring-brand-amber/15">
              <img
                src={`${import.meta.env.BASE_URL}profile.jpg`}
                alt="Pawan Danani out on the water"
                width={499}
                height={446}
                loading="lazy"
                className="block w-full saturate-[0.92]"
              />
              {/* dusk grade: melts the daylight shot into the night-sea */}
              <div aria-hidden className="about-photo-grade absolute inset-0" />
            </div>
          </figure>
        </Reveal>

        <Reveal amount={0.3} className="max-w-xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hi — I&apos;m Pawan, a software engineer based in New York. I
            studied Computer Science and Economics at Stony Brook University,
            and I&apos;ve spent the years since building software people lean on
            every day: retail point-of-sale platforms, geospatial analysis
            tools, internal AI assistants.
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I like systems that hold up in rough water — resilient under load,
            honest in their failure modes, and pleasant to work in. The ocean
            theme isn&apos;t an accident.
          </p>
          <p className="mt-6 font-mono text-xs tracking-widest text-brand-amber/90 uppercase">
            Stony Brook University · B.S. Computer Science &amp; B.S. Economics
            · 2021
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
