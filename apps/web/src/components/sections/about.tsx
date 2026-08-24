import { useReducedMotion } from 'motion/react'
import { Reveal } from '#/components/motion/reveal'
import { StaggerGroup, StaggerItem } from '#/components/motion/stagger'
import { ZeldaWarp, useZeldaWarp } from '#/components/zelda-warp'
import { fallItem } from '#/lib/motion/variants'
import { cn } from '#/lib/utils'
import { Section, SectionHeading } from './section'

/* Scattered polaroid-style stickers rather than plain tag chips — each
   tilted like the profile photo (`-rotate-1 hover:rotate-0` below), so the
   interaction language echoes across the section instead of introducing a
   new one. Tilt classes are static (not computed) so Tailwind's JIT scanner
   can see them. `spin` seeds the tumble-in fall (fallItem below) — varied
   per item so the group doesn't fall in lockstep. `warp` marks the one
   sticker that's an easter egg (see zelda-warp.tsx). */
const INTERESTS = [
  { emoji: '🍽️', label: 'NYC eats', tilt: '-rotate-3', spin: -22 },
  { emoji: '🚴', label: 'Biking', tilt: 'rotate-2', spin: 18 },
  { emoji: '🥾', label: 'Hiking', tilt: '-rotate-2', spin: -16 },
  { emoji: '⌨️', label: 'Keyboards', tilt: 'rotate-3', spin: 24 },
  { emoji: '🍿', label: 'Movies', tilt: '-rotate-1', spin: -20 },
  { emoji: '🍷', label: 'Wine', tilt: 'rotate-1', spin: 16 },
  { emoji: '🎮', label: 'Gaming', tilt: '-rotate-1', spin: -18, warp: true },
  { emoji: '🏀', label: 'Sports', tilt: 'rotate-3', spin: 20 },
]

const CARD =
  'waves-glass relative flex flex-col items-center gap-2 rounded-2xl border border-brand-amber/15 px-6 py-5 shadow-[0_12px_34px_oklch(0.72_0.18_50_/_0.14)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0'

function StickerFace({ emoji, label }: { emoji: string; label: string }) {
  return (
    <>
      {/* WebKit flattens color emoji to grayscale when it inherits the
          body's `antialiased` (-webkit-font-smoothing), so reset that
          just here. */}
      <span
        aria-hidden
        className="text-6xl"
        style={{ WebkitFontSmoothing: 'auto' }}
      >
        {emoji}
      </span>
      <span className="font-mono text-xs tracking-[0.2em] text-brand-amber/90 uppercase">
        {label}
      </span>
    </>
  )
}

/** The Gaming sticker: haloed, and a button — hover or tap warps to Hyrule. */
function ZeldaSticker({
  emoji,
  label,
  tilt,
}: {
  emoji: string
  label: string
  tilt: string
}) {
  const { state, close, triggerProps } = useZeldaWarp()
  return (
    <>
      <button
        type="button"
        className={cn(CARD, 'zelda-halo cursor-pointer', tilt)}
        aria-label={`${label} — hover or tap for a surprise`}
        {...triggerProps}
      >
        <StickerFace emoji={emoji} label={label} />
      </button>
      <ZeldaWarp state={state} onDismiss={close} />
    </>
  )
}

export function AboutSection() {
  const reduce = useReducedMotion()

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
              {/* dusk grade: melts the daylight shot into the water */}
              <div aria-hidden className="about-photo-grade absolute inset-0" />
            </div>
          </figure>
        </Reveal>

        <Reveal className="max-w-xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hi — I&apos;m Pawan, a software engineer based in New York. I
            studied Computer Science and Economics at Stony Brook University,
            and I&apos;ve spent the years since building software people lean on
            every day: retail point-of-sale platforms, geospatial analysis
            tools, internal AI assistants.
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Outside of work I&apos;m usually hunting down a new restaurant
            somewhere in New York (I&apos;ve tried like a million). When
            I&apos;m not eating my way through the city, I&apos;m biking,
            hiking, catching up on the latest movies, or adding to an
            ever-growing keyboard collection.
          </p>

          {/* justify-center so a narrower trailing row of stickers sits
              centred under the row above instead of hugging the left edge */}
          <StaggerGroup className="mt-8 flex flex-wrap justify-center gap-6">
            {INTERESTS.map(({ emoji, label, tilt, spin, warp }) => (
              <StaggerItem
                key={label}
                variants={fallItem(reduce ?? false, spin)}
              >
                {warp ? (
                  <ZeldaSticker emoji={emoji} label={label} tilt={tilt} />
                ) : (
                  <div className={cn(CARD, tilt)}>
                    <StickerFace emoji={emoji} label={label} />
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>

          <p className="mt-6 text-center font-mono text-xs tracking-wide text-brand-amber/90 uppercase sm:whitespace-nowrap">
            Stony Brook University · B.S. Computer Science &amp; B.S. Economics
            · 2021
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
