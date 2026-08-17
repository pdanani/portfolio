import { Reveal } from '#/components/motion/reveal'
import { Section, SectionHeading } from './section'

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeading number="01" title="About" />

      <div className="flex flex-col items-start gap-10 sm:flex-row sm:gap-14">
        <Reveal className="shrink-0">
          <img
            src="/profile.jpg"
            alt="Pawan Danani by the water"
            width={499}
            height={446}
            loading="lazy"
            className="w-56 rounded-2xl border border-border shadow-[0_18px_50px_oklch(0.72_0.18_50_/_0.12)] sm:w-64"
          />
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
