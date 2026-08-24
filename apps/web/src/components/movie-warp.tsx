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

/** Kernels pop into place until the page is buried; then they pop away. */
const OPEN_MS = 1500
const CLOSE_MS = 650
/** Just kernels — enough of them to bury the page on their own. */
const KERNELS = 210

export function useMovieWarp() {
  return useWarp({ fill: OPEN_MS, dissolve: CLOSE_MS })
}

const SEATS = Array.from({ length: 3 }, (_, row) => row)

/* One popping per open. No flight paths — each kernel just pops into
   place somewhere on the screen at its own moment, and pops away again
   at its own moment (--od) when the scene opens. Client-only. */
function popKernels() {
  const w = window.innerWidth
  const h = window.innerHeight
  return Array.from({ length: KERNELS }, () => ({
    tx: Math.random() * w,
    ty: Math.random() * h,
    s: 1 + Math.random() * 0.8,
    rr: (Math.random() - 0.5) * 180,
    delay: Math.random() * 1100,
    od: Math.random() * 420,
    hue: 80 + Math.random() * 14,
  }))
}

/** Mounts fresh on every open, so no two poppings are alike. */
function PopcornPile() {
  const [kernels] = useState(popKernels)
  return (
    <div className="movie-pile">
      {kernels.map((k, i) => (
        <span
          key={i}
          className="movie-kernel"
          style={
            {
              '--tx': `${k.tx}px`,
              '--ty': `${k.ty}px`,
              '--s': k.s,
              '--rr': `${k.rr}deg`,
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
 * "Extra butter": kernels pop straight onto the screen — no flight, just
 * corn popping wherever it pops, faster and faster until the page is
 * buried and the house has gone dark; then they pop away again, and the
 * cinema is just there (screen + ticket stub under the beam, silhouetted
 * seats). Leaving fades the lights back up. Pure CSS keyframes for the
 * pops; house/scene fades are Web Animations. Portalled to <body>;
 * decorative.
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
