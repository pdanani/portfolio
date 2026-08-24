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

/** One continuous zoom-out from the record; leaving zooms back in. */
const GROW_MS = 1300
const SHRINK_MS = 600
/** How magnified the room starts: the record's centre fills the sticker. */
const START_SCALE = 3
const EASE_OUT = 'cubic-bezier(0.3, 0.6, 0.15, 1)'
const EASE_IN = 'cubic-bezier(0.6, 0, 0.8, 0.3)'

export function useVinylWarp() {
  return useWarp({ fill: GROW_MS, dissolve: SHRINK_MS })
}

const STROBE = Array.from({ length: 36 }, (_, i) => i * 10)

/**
 * "The record drops": the listening room is on screen from the first frame,
 * magnified so the record's centre sits on the Music sticker, and one eased
 * animation zooms it out to the full turntable while a clip circle grows
 * from the sticker — no fade, no pop. Leaving runs it in reverse. Both are
 * Web Animations on the compositor (transform + clip-path). Portalled to
 * <body>; decorative.
 */
export function VinylWarp({
  state,
  onDismiss,
}: {
  state: WarpState
  onDismiss: () => void
}) {
  const reduce = useReducedMotion()
  const warpRef = useRef<HTMLDivElement>(null)
  const roomRef = useRef<HTMLDivElement>(null)
  const recordRef = useRef<HTMLDivElement>(null)
  const { phase, origin } = state

  // Zoom: the record's centre (measured at scale 1) maps onto the sticker.
  useLayoutEffect(() => {
    const warp = warpRef.current
    const room = roomRef.current
    const record = recordRef.current
    if (!warp || !room || !record) return
    if (phase !== 'opening' && phase !== 'closing') return
    const r = record.getBoundingClientRect()
    const rx = r.left + r.width / 2
    const ry = r.top + r.height / 2
    room.style.transformOrigin = `${rx}px ${ry}px`
    const zoomed = `translate(${origin.x - rx}px, ${origin.y - ry}px) scale(${START_SCALE})`
    const clipIn = `circle(0px at ${origin.x}px ${origin.y}px)`
    const clipOut = `circle(150vmax at ${origin.x}px ${origin.y}px)`
    const opening = phase === 'opening'
    const options: KeyframeAnimationOptions = {
      duration: reduce ? 1 : opening ? GROW_MS : SHRINK_MS,
      easing: opening ? EASE_OUT : EASE_IN,
      fill: 'both',
    }
    const frames = opening
      ? [{ transform: zoomed }, { transform: 'translate(0px, 0px) scale(1)' }]
      : [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: zoomed }]
    const clips = opening
      ? [{ clipPath: clipIn }, { clipPath: clipOut }]
      : [{ clipPath: clipOut }, { clipPath: clipIn }]
    // fill: 'both' keeps the end state after finishing; nothing to cancel —
    // the next phase's animations simply take over, and unmount drops them.
    room.animate(frames, options)
    warp.animate(clips, options)
  }, [phase, origin, reduce])

  if (phase === 'closed' || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={warpRef}
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
                <div ref={recordRef} className="vinyl-record">
                  <span className="vinyl-sheen" />
                  <div className="vinyl-label">
                    <span className="vinyl-label-name">Pawan Danani</span>
                    <span className="vinyl-label-sub">LP · 33⅓</span>
                  </div>
                </div>
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
    </div>,
    document.body,
  )
}
