import { EXPERIENCE } from '#/data/experience'
import { formatRange } from '#/lib/format'
import { Chip } from '#/components/chip'
import { Reveal } from '#/components/motion/reveal'
import { Section, SectionHeading } from './section'

export function ExperienceSection() {
  return (
    <Section id="experience">
      <SectionHeading number="02" title="Experience" />

      <ol className="relative space-y-16 border-l border-border/60">
        {EXPERIENCE.map((job) => (
          <li
            key={`${job.company}-${job.start}`}
            className="relative pl-8 sm:pl-12"
          >
            {/* harbor-light marker on the timeline */}
            <span
              aria-hidden
              className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-brand-amber shadow-[0_0_12px_2px_oklch(0.82_0.15_75_/_0.45)]"
            />
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-xl text-foreground">
                  {job.role}{' '}
                  <span className="text-brand-amber">· {job.company}</span>
                </h3>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {formatRange(job.start, job.end)}
                  {job.location ? ` · ${job.location}` : ''}
                </p>
              </div>

              <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                {job.summary}
              </p>

              {job.tech.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.tech.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
