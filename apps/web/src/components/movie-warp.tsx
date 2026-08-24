import { useLayoutEffect, useRef } from 'react'
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

/** Lights dim, curtains draw open; leaving closes them and brings the lights up. */
const OPEN_MS = 1400
const CLOSE_MS = 900
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_IN = 'cubic-bezier(0.55, 0, 0.8, 0.35)'

export function useMovieWarp() {
  return useWarp({ fill: OPEN_MS, dissolve: CLOSE_MS })
}

const SEATS = Array.from({ length: 3 }, (_, row) => row)

/**
 * "Curtains up": the page dims like house lights, two pleated curtains part
 * from the centre to the wings, and the screen behind them lights up under
 * a projector beam. Only the curtains move. Leaving draws them closed and
 * fades the lights back up. Web Animations (transform + opacity).
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
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const { phase } = state

  useLayoutEffect(() => {
    const house = houseRef.current
    const left = leftRef.current
    const right = rightRef.current
    const screen = screenRef.current
    if (!house || !left || !right || !screen) return
    if (phase !== 'opening' && phase !== 'closing') return
    const opening = phase === 'opening'
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
    const draw = (
      el: HTMLElement,
      from: string,
      to: string,
      ms: number,
      delay = 0,
    ) =>
      el.animate([{ transform: from }, { transform: to }], {
        duration: t(ms),
        delay: t(delay),
        easing: opening ? EASE_OUT : EASE_IN,
        fill: 'both',
      })
    if (opening) {
      fade(house, 0, 1, 380)
      draw(left, 'translateX(0)', 'translateX(-88%)', 1000, 320)
      draw(right, 'translateX(0)', 'translateX(88%)', 1000, 320)
      fade(screen, 0, 1, 700, 520)
    } else {
      draw(left, 'translateX(-88%)', 'translateX(0)', 650)
      draw(right, 'translateX(88%)', 'translateX(0)', 650)
      fade(screen, 1, 0, 400, 200)
      fade(house, 1, 0, 350, 550)
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
        {/* the screen + projector beam, behind the curtains */}
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

        {/* the curtains: pleated, parting to the wings */}
        <div ref={leftRef} className="movie-curtain movie-curtain-left" />
        <div ref={rightRef} className="movie-curtain movie-curtain-right" />
        <div className="movie-valance" />

        <p className="movie-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>
    </div>,
    document.body,
  )
}
