import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { Reveal } from '#/components/motion/reveal'
import { StaggerGroup, StaggerItem } from '#/components/motion/stagger'
import { VinylWarp, useVinylWarp } from '#/components/vinyl-warp'
import { ZeldaWarp, useZeldaWarp } from '#/components/zelda-warp'
import { IN_VIEW } from '#/lib/motion/in-view'
import { fallItem } from '#/lib/motion/variants'
import { cn } from '#/lib/utils'
import { Section, SectionHeading } from './section'

/* Scattered polaroid-style stickers rather than plain tag chips — each
   tilted like the profile photo (`-rotate-1 hover:rotate-0` below), so the
   interaction language echoes across the section instead of introducing a
   new one. Tilt classes are static (not computed) so Tailwind's JIT scanner
   can see them. `spin` seeds the tumble-in fall (fallItem below) — varied
   per item so the group doesn't fall in lockstep. `warp` marks the two
   stickers that are easter eggs (zelda-warp.tsx, vinyl-warp.tsx); every
   other one is a plain card. */
const INTERESTS = [
  { emoji: '🍽️', label: 'NYC eats', tilt: '-rotate-3', spin: -22 },
  { emoji: '🚴', label: 'Biking', tilt: 'rotate-2', spin: 18 },
  { emoji: '🥾', label: 'Hiking', tilt: '-rotate-2', spin: -16 },
  { emoji: '⌨️', label: 'Keyboards', tilt: 'rotate-3', spin: 24 },
  { emoji: '🍿', label: 'Movies', tilt: '-rotate-1', spin: -20 },
  { emoji: '🎵', label: 'Music', tilt: 'rotate-1', spin: 16, warp: 'vinyl' },
  { emoji: '🎮', label: 'Gaming', tilt: '-rotate-1', spin: -18, warp: 'zelda' },
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
  // the pointer draws itself on once the card has landed in view
  const ref = useRef<HTMLDivElement>(null)
  const drawn = useInView(ref, { once: true, ...IN_VIEW })
  return (
    <div ref={ref} className="relative" data-drawn={drawn || undefined}>
      <button
        type="button"
        className={cn(CARD, 'zelda-halo cursor-pointer', tilt)}
        aria-label={`${label} — hover or tap for a surprise`}
        {...triggerProps}
      >
        <StickerFace emoji={emoji} label={label} />
      </button>

      {/* Hand-drawn pointer hanging off the card: curls up from the note
          into the sticker's bottom edge, drawn on (not tumbled in) once
          the card is in view. Anchored to the card, so it keeps pointing
          at it wherever the grid wraps. The sketched wobble is baked into
          the path data — it used to come from an feTurbulence +
          feDisplacementMap filter, but WebKit re-ran that filter on every
          frame of the stroke draw and of the bob that follows, which is
          what made the arrow crawl on iOS. */}
      <div aria-hidden className="zelda-point">
        <svg viewBox="0 0 160 112" className="zelda-point-arrow">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              pathLength={1}
              d="M 148.4 98.4 C 145.4 98.6, 136.8 99.4, 130.5 99.7 C 124.2 100.0, 116.8 100.3, 110.7 100.2 C 104.6 100.1, 99.0 100.4, 94.0 99.0 C 88.9 97.7, 84.7 94.5, 80.3 92.1 C 76.0 89.8, 72.1 88.2, 67.9 85.2 C 63.8 82.2, 58.3 77.7, 55.5 74.1 C 52.6 70.4, 52.4 66.9, 51.0 63.2 C 49.5 59.6, 48.2 54.9, 46.8 52.2 C 45.5 49.5, 43.8 49.3, 42.9 46.9 C 41.9 44.6, 41.7 40.9, 41.2 38.1 C 40.8 35.3, 40.6 32.4, 40.2 30.3 C 39.8 28.3, 38.9 27.9, 38.6 25.8 C 38.3 23.8, 38.7 20.5, 38.3 18.0 C 37.9 15.5, 36.6 11.9, 36.3 10.7"
            />
            <path
              pathLength={1}
              d="M 23.6 24.4 C 24.0 23.8, 25.3 22.0, 26.2 20.8 C 27.1 19.5, 27.8 18.2, 28.8 16.9 C 29.9 15.6, 31.1 14.2, 32.4 12.9 C 33.7 11.6, 35.5 9.2, 36.6 9.0 C 37.8 8.9, 38.4 10.6, 39.5 11.8 C 40.5 13.1, 42.1 15.2, 42.9 16.5 C 43.8 17.8, 44.1 18.5, 44.7 19.5 C 45.3 20.6, 46.2 22.2, 46.6 22.8"
            />
          </g>
        </svg>
        <span className="zelda-point-label">???</span>
      </div>

      <ZeldaWarp state={state} onDismiss={close} />
    </div>
  )
}

/* Notes that fall out of the Music sticker: start x (% of the card), loop
   duration, and stagger, varied so they never fall in step. */
const NOTES = [
  { glyph: '♪', x: '18%', d: '3.6s', t: '0s' },
  { glyph: '♫', x: '62%', d: '4.2s', t: '-1.4s' },
  { glyph: '♩', x: '40%', d: '3.9s', t: '-2.6s' },
  { glyph: '♪', x: '80%', d: '4.6s', t: '-0.7s' },
]

/** The Music sticker: warm halo; hover or tap drops a record over the page. */
function VinylSticker({ label, tilt }: { label: string; tilt: string }) {
  const { state, close, triggerProps } = useVinylWarp()
  return (
    <div className="relative">
      {/* the card is a miniature of the scene's turntable: wood plinth, deck,
          platter with the record turning, a tiny tonearm resting on it */}
      <button
        type="button"
        className={cn(
          'vinyl-card vinyl-halo relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl px-4 py-3 transition-transform duration-500 hover:-translate-y-1 hover:rotate-0',
          tilt,
        )}
        aria-label={`${label} — hover or tap for a surprise`}
        {...triggerProps}
      >
        <span aria-hidden className="vinyl-mini">
          <span className="vinyl-mini-platter">
            <span className="vinyl-record">
              <span className="vinyl-sheen" />
              <span className="vinyl-label">
                <span className="vinyl-label-name">Pawan Danani</span>
                <span className="vinyl-label-sub">LP · 33⅓</span>
              </span>
            </span>
            <span className="vinyl-mini-spindle" />
          </span>
          <span className="vinyl-mini-arm" />
          <span className="vinyl-mini-knob" />
          <span className="vinyl-mini-led" />
        </span>
        <span className="font-mono text-xs tracking-[0.2em] text-brand-amber/90 uppercase">
          {label}
        </span>
      </button>
      {/* notes drifting down out of the card and fading away */}
      <div aria-hidden className="vinyl-notes">
        {NOTES.map((n, i) => (
          <span
            key={i}
            style={{ '--x': n.x, '--d': n.d, '--t': n.t } as CSSProperties}
          >
            {n.glyph}
          </span>
        ))}
      </div>
      <VinylWarp state={state} onDismiss={close} />
    </div>
  )
}

export function AboutSection() {
  const reduce = useReducedMotion()
  /* The stickers carry several `infinite` decorations (the spinning halo
     rings, the falling notes, the turning record, the arrow's bob). They
     used to keep running while the section was scrolled away, burning a
     frame budget nobody could see. `data-live` parks them until the group
     is actually on screen — note `once: false`, unlike the reveal triggers. */
  const stickersRef = useRef<HTMLDivElement>(null)
  const stickersLive = useInView(stickersRef, { once: false, ...IN_VIEW })

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
            {/* written on the polaroid: tilts (and straightens) with it */}
            <figcaption className="mt-4 text-center font-mono text-xs leading-relaxed tracking-wide text-brand-amber/90 uppercase">
              <span className="block">Stony Brook University</span>
              <span className="block">B.S. Computer Science</span>
              <span className="block">B.S. Economics · 2021</span>
            </figcaption>
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
              centred under the row above instead of hugging the left edge;
              pb-32 is the room for the arrow hanging off the Gaming sticker */}
          <div
            ref={stickersRef}
            className="interest-stickers"
            data-live={stickersLive || undefined}
          >
            <StaggerGroup className="mt-8 flex flex-wrap justify-center gap-6 pb-32">
              {INTERESTS.map(({ emoji, label, tilt, spin, warp }) => (
                <StaggerItem
                  key={label}
                  variants={fallItem(reduce ?? false, spin)}
                >
                  {warp === 'zelda' ? (
                    <ZeldaSticker emoji={emoji} label={label} tilt={tilt} />
                  ) : warp === 'vinyl' ? (
                    <VinylSticker label={label} tilt={tilt} />
                  ) : (
                    <div className={cn(CARD, tilt)}>
                      <StickerFace emoji={emoji} label={label} />
                    </div>
                  )}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
