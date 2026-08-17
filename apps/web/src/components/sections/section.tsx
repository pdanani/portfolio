import type { ReactNode } from 'react'
import { Reveal } from '#/components/motion/reveal'
import { cn } from '#/lib/utils'

export function Section({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto max-w-5xl scroll-mt-8 px-6 py-20 sm:py-28',
        className,
      )}
    >
      {children}
    </section>
  )
}

/** Numbered amber eyebrow + display title, echoing the hero's type treatment. */
export function SectionHeading({
  number,
  title,
  blurb,
  align = 'left',
}: {
  number: string
  title: string
  blurb?: string
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <Reveal className="mb-12 sm:mb-16">
      <p
        className={cn(
          'flex items-center gap-4 font-mono text-xs tracking-[0.42em] text-brand-amber uppercase',
          centered && 'justify-center',
        )}
      >
        {centered ? (
          <span aria-hidden className="h-px w-12 bg-brand-amber/40" />
        ) : null}
        {number}
        <span aria-hidden className="h-px w-12 bg-brand-amber/40" />
      </p>
      <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        {title}
      </h2>
      {blurb ? (
        <p
          className={cn(
            'mt-3 max-w-xl text-muted-foreground',
            centered && 'mx-auto',
          )}
        >
          {blurb}
        </p>
      ) : null}
    </Reveal>
  )
}
