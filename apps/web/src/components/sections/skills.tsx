import { SKILLS } from '#/data/skills'
import { Chip } from '#/components/chip'
import { StaggerGroup, StaggerItem } from '#/components/motion/stagger'
import { Section, SectionHeading } from './section'

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading number="03" title="Toolbox" />

      <StaggerGroup className="grid gap-10 sm:grid-cols-3" amount={0.2}>
        {SKILLS.map((group) => (
          <StaggerItem key={group.label}>
            <h3 className="font-mono text-xs tracking-[0.3em] text-brand-amber uppercase">
              {group.label}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  )
}
