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

/** Lights down (150) + three leader counts (3 × 360) + the splice flash. */
const OPEN_MS = 1420
const CLOSE_MS = 650

export function useMovieWarp() {
  return useWarp({ fill: OPEN_MS, dissolve: CLOSE_MS })
}

const SEATS = Array.from({ length: 3 }, (_, row) => row)
/* Each numeral's slot in the countdown (ms after mount). */
const COUNTS = [
  { n: 3, delay: 150 },
  { n: 2, delay: 510 },
  { n: 1, delay: 870 },
]

/**
 * "Roll film": the house lights snap down and the projector throws a dusty
 * film leader across the whole viewport — crosshairs, rings, grain, and a
 * sector sweep counting 3 · 2 · 1 — then a one-frame splice flash cuts to
 * the cinema: a glowing screen with a ticket stub under the beam, over
 * silhouetted seats. Leaving flickers out and fades the lights back up.
 * The countdown is pure CSS; house/scene fades are Web Animations.
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
      // lights snap down; the scene is revealed by the splice at the end
      fade(house, 0, 1, 150)
      fade(screen, 0, 1, 120, OPEN_MS - 160)
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

        {/* the film leader, only during the countdown */}
        {phase === 'opening' ? (
          <div className="movie-leader">
            <div className="movie-grain" />
            <span className="movie-leader-ring movie-leader-ring-outer" />
            <span className="movie-leader-ring movie-leader-ring-inner" />
            <span className="movie-leader-sweep" />
            {COUNTS.map(({ n, delay }) => (
              <span
                key={n}
                className="movie-leader-num"
                style={{ animationDelay: `${delay}ms` }}
              >
                {n}
              </span>
            ))}
            <span className="movie-splice" />
          </div>
        ) : null}

        <p className="movie-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>
    </div>,
    document.body,
  )
}
