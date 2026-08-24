import { Github, Linkedin } from 'lucide-react'
import { PROFILE } from '#/data/profile'

const ICONS = { GitHub: Github, LinkedIn: Linkedin } as const

/** Slim closing footer — GitHub + LinkedIn live in the hero too, so this just keeps
    the conventional links at the bottom of the page. */
export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-10">
      <div className="flex flex-col items-center gap-5 border-t border-border/40 pt-8">
        <div className="flex items-center gap-6">
          {PROFILE.links
            .filter((link) => link.label in ICONS)
            .map((link) => {
              const Icon = ICONS[link.label as keyof typeof ICONS]
              return (
                <a
                  key={link.label}
                  href={link.url}
                  {...(link.url.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  aria-label={link.label}
                  className="text-muted-foreground transition hover:text-brand-amber"
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
        </div>
        <p className="font-mono text-xs text-muted-foreground/70">
          © 2026 {PROFILE.name} · built on TanStack Start, Tailwind, and a WebGL
          sunset
        </p>
      </div>
    </footer>
  )
}
