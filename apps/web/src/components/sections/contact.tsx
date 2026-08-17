import { Github, Linkedin } from 'lucide-react'
import { PROFILE } from '#/data/profile'
import { Reveal } from '#/components/motion/reveal'
import { Section, SectionHeading } from './section'

const ICONS = { GitHub: Github, LinkedIn: Linkedin } as const

export function ContactSection() {
  return (
    <Section id="contact" className="pb-14 text-center">
      <div className="mx-auto max-w-xl">
        <SectionHeading number="04" title="Get in touch" align="center" />

        <Reveal>
          <p className="text-muted-foreground -mt-6 leading-relaxed">
            Always up for talking resilient systems, a product idea, or a
            problem worth building for. My inbox is open.
          </p>

          <div className="mt-9 flex items-center justify-center gap-5">
            <a
              href={`mailto:${PROFILE.email}`}
              className="rounded-[0.4rem] bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              style={{
                boxShadow:
                  '0 8px 30px color-mix(in oklab, var(--primary) 45%, transparent)',
              }}
            >
              Say hello
            </a>
            {PROFILE.links
              .filter((link) => link.label in ICONS)
              .map((link) => {
                const Icon = ICONS[link.label as keyof typeof ICONS]
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="text-muted-foreground transition hover:text-brand-amber"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
          </div>
        </Reveal>

        <footer className="mt-24 border-t border-border/40 pt-6">
          <p className="font-mono text-xs text-muted-foreground/70">
            © 2026 {PROFILE.name} · built on TanStack Start, Tailwind, and a
            WebGL sunset
          </p>
        </footer>
      </div>
    </Section>
  )
}
