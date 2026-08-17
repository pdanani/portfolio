import { ArrowUpRight } from 'lucide-react'
import { PROJECTS } from '#/data/projects'
import { Chip } from '#/components/chip'
import { StaggerGroup, StaggerItem } from '#/components/motion/stagger'
import { Section, SectionHeading } from './section'
import type { Project } from '#/data/types'

function ProjectCard({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.githubUrl

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-foreground">
          {project.title}
        </h3>
        {href ? (
          <ArrowUpRight
            aria-hidden
            className="mt-1 h-4 w-4 shrink-0 text-brand-amber opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {project.tech.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </>
  )

  const shell =
    'waves-glass group flex h-full flex-col rounded-lg border border-border p-6 transition duration-300'

  // whole card is the link when there's somewhere to go
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title} on GitHub`}
      className={`${shell} hover:-translate-y-1 hover:border-brand-amber/50 hover:shadow-[0_14px_40px_oklch(0.72_0.18_50_/_0.14)] focus-visible:border-brand-amber/50`}
    >
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  )
}

export function ProjectsSection() {
  return (
    <Section id="projects">
      <SectionHeading
        number="03"
        title="Selected projects"
        blurb="Systems work and product builds — a few will dock here as live apps over time."
      />

      <StaggerGroup className="grid gap-5 sm:grid-cols-2" amount={0.1}>
        {PROJECTS.map((project) => (
          <StaggerItem key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  )
}
