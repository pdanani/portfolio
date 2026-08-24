import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { useWarp } from './warp'
import type { WarpState } from './warp'

/* Everything the overlay says, in one place. */
const COPY = {
  eyebrow: 'Sidequest',
  title: 'Now spinning',
  body: 'Records, headphones, whatever’s on — there is always music playing.',
  side: 'Side A',
  sideNote: 'On repeat',
  tracks: [
    { no: '01', title: 'Tame Impala', time: '4:20' },
    { no: '02', title: 'Red Hot Chili Peppers', time: '3:33' },
    { no: '03', title: 'Parcels', time: '5:01' },
    { no: '04', title: 'Frank Ocean', time: '2:58' },
  ],
  hintHover: 'move away to lift the needle',
  hintTap: 'tap anywhere to lift the needle',
}

/** The disc flies from the sticker to the platter; leaving flies it back. */
const FLY_MS = 1000
const RETURN_MS = 550
/** Disc size while it's still "in" the sticker. */
const START_SIZE = 56
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_IN = 'cubic-bezier(0.55, 0, 0.8, 0.35)'

export function useVinylWarp() {
  return useWarp({ fill: FLY_MS, dissolve: RETURN_MS })
}

const STROBE = Array.from({ length: 36 }, (_, i) => i * 10)

/**
 * "The record drops": a vinyl disc pops out of the Music sticker, flies
 * across the screen spinning on its own axis and growing as it goes, and
 * lands on the turntable's platter while the listening room fades up
 * around it. The room never moves; only the record does. Leaving flies it
 * back into the sticker. Web Animations on the compositor (transform +
 * opacity). Portalled to <body>; decorative.
 */
export function VinylWarp({
  state,
  onDismiss,
}: {
  state: WarpState
  onDismiss: () => void
}) {
  const reduce = useReducedMotion()
  const floorRef = useRef<HTMLDivElement>(null)
  const roomRef = useRef<HTMLDivElement>(null)
  const recordRef = useRef<HTMLDivElement>(null)
  const flyRef = useRef<HTMLDivElement>(null)
  const discRef = useRef<HTMLDivElement>(null)
  const { phase, origin } = state

  useLayoutEffect(() => {
    const floor = floorRef.current
    const room = roomRef.current
    const record = recordRef.current
    const fly = flyRef.current
    const disc = discRef.current
    if (!floor || !room || !record || !fly || !disc) return
    if (phase !== 'opening' && phase !== 'closing') return
    const opening = phase === 'opening'
    // park the flying disc exactly over the platter's (hidden) record
    const r = record.getBoundingClientRect()
    fly.style.left = `${r.left}px`
    fly.style.top = `${r.top}px`
    fly.style.width = `${r.width}px`
    fly.style.height = `${r.height}px`
    const inSticker = `translate(${origin.x - (r.left + r.width / 2)}px, ${origin.y - (r.top + r.height / 2)}px) scale(${START_SIZE / r.width})`
    const onPlatter = 'translate(0px, 0px) scale(1)'
    const flight: KeyframeAnimationOptions = {
      duration: reduce ? 1 : opening ? FLY_MS : RETURN_MS,
      easing: opening ? EASE_OUT : EASE_IN,
      fill: 'both',
    }
    fly.animate(
      opening
        ? [{ transform: inSticker }, { transform: onPlatter }]
        : [{ transform: onPlatter }, { transform: inSticker }],
      flight,
    )
    // the disc spins hard during the flight, then settles to 33⅓
    if (opening) {
      const spin = disc.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(900deg)' }],
        { duration: reduce ? 1 : FLY_MS + 400, easing: EASE_OUT, fill: 'both' },
      )
      spin.onfinish = () => {
        spin.cancel()
        disc.animate(
          [{ transform: 'rotate(180deg)' }, { transform: 'rotate(540deg)' }],
          { duration: 6000, iterations: Infinity, easing: 'linear' },
        )
      }
    }
    // the room fades up around the landing disc; the floor dims the page
    const fade = (
      el: HTMLElement,
      from: number,
      to: number,
      delay: number,
      ms: number,
    ) =>
      el.animate([{ opacity: from }, { opacity: to }], {
        duration: reduce ? 1 : ms,
        delay: reduce ? 0 : delay,
        easing: 'ease-out',
        fill: 'both',
      })
    if (opening) {
      fade(floor, 0, 1, 0, 450)
      fade(room, 0, 1, 380, 520)
    } else {
      fade(room, 1, 0, 0, 220)
      fade(floor, 1, 0, 150, 400)
    }
  }, [phase, origin, reduce])

  if (phase === 'closed' || typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-hidden
      className="vinyl-warp"
      data-state={state.phase}
      data-mode={state.mode}
      onClick={state.mode === 'pinned' ? onDismiss : undefined}
      style={
        {
          '--x': `${state.origin.x}px`,
          '--y': `${state.origin.y}px`,
        } as CSSProperties
      }
    >
      <div ref={floorRef} className="vinyl-floor" />
      <div ref={roomRef} className="vinyl-room">
        <div className="vinyl-vignette" />

        <div className="vinyl-layout">
          {/* the turntable */}
          <div className="vinyl-plinth">
            <div className="vinyl-deck">
              <div className="vinyl-platter">
                <span className="vinyl-strobe">
                  {STROBE.map((a) => (
                    <i key={a} style={{ '--a': `${a}deg` } as CSSProperties} />
                  ))}
                </span>
                {/* a ghost: the flying disc lands on this exact spot */}
                <div
                  ref={recordRef}
                  className="vinyl-record vinyl-record-ghost"
                />
                <span className="vinyl-spindle" />
                <div className="vinyl-tonearm">
                  <span className="vinyl-arm-pivot" />
                  <span className="vinyl-arm-counter" />
                  <span className="vinyl-arm-tube">
                    <span className="vinyl-arm-head" />
                  </span>
                </div>
              </div>

              <div className="vinyl-controls">
                <div className="vinyl-controls-left">
                  <span className="vinyl-knob" />
                  <span className="vinyl-btn">
                    <span className="vinyl-btn-led" />
                    Start / Stop
                  </span>
                </div>
                <div className="vinyl-rpm">
                  <i data-on="true">33</i>
                  <i data-on="false">45</i>
                </div>
              </div>
            </div>
            <div className="vinyl-feet">
              <span />
              <span />
            </div>
          </div>

          {/* copy + tracklist */}
          <div className="vinyl-copy">
            <p className="vinyl-eyebrow">
              <span className="vinyl-eyebrow-dot" />
              {COPY.eyebrow}
            </p>
            <h2 className="vinyl-title">{COPY.title}</h2>
            <p className="vinyl-body">{COPY.body}</p>
            <div className="vinyl-sleeve">
              <div className="vinyl-sleeve-head">
                <span>{COPY.side}</span>
                <span>{COPY.sideNote}</span>
              </div>
              <ul>
                {COPY.tracks.map((t) => (
                  <li key={t.no} className="vinyl-track">
                    <span className="vinyl-track-no">{t.no}</span>
                    <span className="vinyl-track-dot" />
                    <span className="vinyl-track-title">{t.title}</span>
                    <span className="vinyl-track-time">{t.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="vinyl-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>

      {/* the record itself: flies from the sticker to the platter */}
      <div ref={flyRef} className="vinyl-fly">
        <div ref={discRef} className="vinyl-record">
          <span className="vinyl-sheen" />
          <div className="vinyl-label">
            <span className="vinyl-label-name">Pawan Danani</span>
            <span className="vinyl-label-sub">LP · 33⅓</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
