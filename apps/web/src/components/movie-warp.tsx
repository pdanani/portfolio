import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'motion/react'
import { useWarp } from './warp'
import type { WarpState } from './warp'

/* Everything the overlay says, in one place. */
const COPY = {
  eyebrow: 'Sidequest',
  title: 'Now showing',
  body: 'Opening weekend, big screen, extra butter. I keep up with the latest movies — and I have opinions about the trailers.',
  ticket: {
    admit: 'Admit one',
    row: 'Row F',
    seat: 'Seat 12',
    screen: 'Screen 1',
    time: 'Late show',
  },
  hintHover: 'move away for the lights',
  hintTap: 'tap anywhere for the lights',
}

/** Popcorn buries the screen, then settles away to reveal the cinema. */
const OPEN_MS = 1500
const CLOSE_MS = 700
/** Kernels in the shower. */
const KERNELS = 240

export function useMovieWarp() {
  return useWarp({ fill: OPEN_MS, dissolve: CLOSE_MS })
}

const SEATS = Array.from({ length: 3 }, (_, row) => row)

/* One random shower per open: where each kernel lands, how big, how it
   tumbles, and how late it pops. Client-only (mounts on interaction). */
function popKernels() {
  const w = window.innerWidth
  const h = window.innerHeight
  return Array.from({ length: KERNELS }, () => ({
    tx: Math.random() * w,
    ty: Math.random() * h,
    s: 0.75 + Math.random() * 0.7,
    r: (Math.random() - 0.5) * 540,
    delay: Math.random() * 520,
    hue: 80 + Math.random() * 14,
  }))
}

/** Mounts fresh on every open, so no two showers are alike. */
function Popcorn({ origin }: { origin: { x: number; y: number } }) {
  const [kernels] = useState(popKernels)
  return (
    <div className="movie-corn">
      {kernels.map((k, i) => (
        <span
          key={i}
          className="movie-kernel"
          style={
            {
              '--ox': `${origin.x}px`,
              '--oy': `${origin.y}px`,
              '--tx': `${k.tx}px`,
              '--ty': `${k.ty}px`,
              '--s': k.s,
              '--r': `${k.r}deg`,
              '--delay': `${k.delay}ms`,
              '--hue': k.hue,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * "Extra butter": kernels burst out of the popcorn sticker and shower
 * across the page until it's buried, the house goes dark underneath, then
 * the popcorn settles away to reveal the cinema — screen lit under a
 * projector beam over silhouetted seats. Leaving fades the lights back up.
 * The shower is CSS keyframes per kernel; the rest is Web Animations.
 * Portalled to <body>; decorative.
 */
export function MovieWarp({
  state,
  onDismiss,
}: {
  state: WarpState
  onDismiss: () => void
}) {
  const reduce = useReducedMotion()
  const houseRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const { phase, origin } = state

  useLayoutEffect(() => {
    const house = houseRef.current
    const screen = screenRef.current
    if (!house || !screen) return
    if (phase !== 'opening' && phase !== 'closing') return
    const t = (ms: number) => (reduce ? 1 : ms)
    const fade = (
      el: HTMLElement,
      from: number,
      to: number,
      ms: number,
      delay = 0,
    ) =>
      el.animate([{ opacity: from }, { opacity: to }], {
        duration: t(ms),
        delay: t(delay),
        easing: 'ease-out',
        fill: 'both',
      })
    if (phase === 'opening') {
      // the house goes dark under the popcorn; the screen lights as it clears
      fade(house, 0, 1, 500, 500)
      fade(screen, 0, 1, 600, 1000)
    } else {
      fade(screen, 1, 0, 300)
      fade(house, 1, 0, 400, 250)
    }
  }, [phase, reduce])

  if (phase === 'closed' || typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-hidden
      className="movie-warp"
      data-state={phase}
      data-mode={state.mode}
      onClick={state.mode === 'pinned' ? onDismiss : undefined}
    >
      <div ref={houseRef} className="movie-house">
        {/* the screen + projector beam */}
        <div ref={screenRef} className="movie-stage">
          <div className="movie-beam" />
          <div className="movie-screen">
            <div className="movie-grain" />
            <p className="movie-eyebrow">{COPY.eyebrow}</p>
            <h2 className="movie-title">{COPY.title}</h2>
            <p className="movie-body">{COPY.body}</p>
            <div className="movie-ticket">
              <span className="movie-ticket-admit">{COPY.ticket.admit}</span>
              <span>{COPY.ticket.screen}</span>
              <span>{COPY.ticket.row}</span>
              <span>{COPY.ticket.seat}</span>
              <span>{COPY.ticket.time}</span>
            </div>
          </div>
          {/* silhouetted rows of seats */}
          <div className="movie-seats">
            {SEATS.map((row) => (
              <div key={row} className="movie-seat-row" />
            ))}
          </div>
        </div>

        <p className="movie-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>

      {/* the shower, above everything */}
      <Popcorn origin={origin} />
    </div>,
    document.body,
  )
}
