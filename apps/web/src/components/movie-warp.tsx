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

/** Popcorn closes in from every edge to the centre, then irises back open. */
const OPEN_MS = 1700
const CLOSE_MS = 650
/** Just kernels — enough of them to bury the page on their own. */
const KERNELS = 240

export function useMovieWarp() {
  return useWarp({ fill: OPEN_MS, dissolve: CLOSE_MS })
}

const SEATS = Array.from({ length: 3 }, (_, row) => row)

/* One flood per open. Kernel i flies in from a random point just outside
   the viewport toward the centre, landing on a ring that shrinks as the
   flood advances — early kernels hug the edges, late ones pack the middle.
   Leaving reverses it: the centre empties first (--od). Client-only. */
function floodKernels() {
  const w = window.innerWidth
  const h = window.innerHeight
  const cx = w / 2
  const cy = h / 2
  const R = Math.hypot(cx, cy)
  return Array.from({ length: KERNELS }, (_, i) => {
    const p = i / KERNELS
    const a = Math.random() * Math.PI * 2
    const ring = R * (1 - p) + Math.random() * 70
    return {
      sx: cx + Math.cos(a) * (R + 160),
      sy: cy + Math.sin(a) * (R + 160),
      tx: cx + Math.cos(a) * ring,
      ty: cy + Math.sin(a) * ring,
      s: 0.85 + Math.random() * 0.75,
      r: (Math.random() - 0.5) * 380,
      dur: 420 + Math.random() * 240,
      delay: p * 1000,
      od: (1 - p) * 450,
      hue: 80 + Math.random() * 14,
    }
  })
}

/** Mounts fresh on every open, so no two floods are alike. */
function PopcornPile() {
  const [kernels] = useState(floodKernels)
  return (
    <div className="movie-pile">
      {kernels.map((k, i) => (
        <span
          key={i}
          className="movie-kernel"
          style={
            {
              '--sx': `${k.sx}px`,
              '--sy': `${k.sy}px`,
              '--tx': `${k.tx}px`,
              '--ty': `${k.ty}px`,
              '--s': k.s,
              '--r': `${k.r}deg`,
              '--dur': `${k.dur}ms`,
              '--delay': `${k.delay}ms`,
              '--od': `${k.od}ms`,
              '--hue': k.hue,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * "Extra butter": popcorn floods in from every edge of the screen — top,
 * sides and bottom — packing inward until the page is buried under
 * kernels; then they fly back out the way they came, centre first,
 * revealing the cinema underneath (screen + ticket stub
 * under the beam, silhouetted seats). Leaving fades the lights back up.
 * The flood is CSS keyframes; house/scene fades are Web Animations.
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
  const { phase } = state

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
      // the house darkens under the rising pile; the scene waits beneath it
      fade(house, 0, 1, 500, 400)
      fade(screen, 0, 1, 350, OPEN_MS - 100)
    } else {
      fade(screen, 1, 0, 240)
      fade(house, 1, 0, 350, 220)
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
        {/* the cinema, revealed by the splice */}
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

      {/* the pile, above everything; pours away once the page is buried */}
      {phase === 'opening' || phase === 'open' ? <PopcornPile /> : null}
    </div>,
    document.body,
  )
}
