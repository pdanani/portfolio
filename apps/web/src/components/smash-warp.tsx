import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'motion/react'

/* Everything the overlay says, in one place. */
const COPY = {
  eyebrow: 'Sidequest',
  title: 'A new challenger approaches!',
  body: 'So when the laptop closes, it’s one more match. Super Smash Bros. — favourite series, no contest.',
  rulesLabel: 'Rules',
  rules: ['3 stock', '8:00', 'Items: on', 'Battlefield'],
  timer: '8:00',
  players: [
    { tag: 'P1 · Pawan', damage: '0%', stocks: 3, hot: false },
    { tag: 'P2 · CPU', damage: '148%', stocks: 1, hot: true },
  ],
  hintHover: 'move away to return',
  hintTap: 'tap anywhere to return',
}

/** 24 × 14 on desktop, 12 × 28 on phones — same count either way. */
const CELLS = 336
/** Mosaic fill; the stage fades in once it's done. */
const FILL_MS = 620
const DISSOLVE_MS = 340
/** Hover intent, so brushing past the sticker doesn't fire it. */
const INTENT_MS = 220
/** Opened by tap: dismiss on its own if nobody taps again. */
const AUTO_CLOSE_MS = 7000

/* Meadow greens for the mosaic — it stays as the field the stage floats over. */
const FIELD = [
  'oklch(0.5 0.1 147)',
  'oklch(0.46 0.09 150)',
  'oklch(0.54 0.11 145)',
  'oklch(0.43 0.09 152)',
]

/* Soft platforms flanking the main stage, kept clear of the centred
   textbox (hidden on phones, where the box spans the width). */
const PLATFORMS = [
  { left: '5%', width: '17%', bottom: '44%' },
  { left: '78%', width: '17%', bottom: '44%' },
]

export type WarpMode = 'hover' | 'pinned'
export type WarpPhase = 'closed' | 'opening' | 'open' | 'closing'
export interface WarpState {
  phase: WarpPhase
  mode: WarpMode
}

type Timers = Partial<
  Record<'intent' | 'auto' | 'phase' | 'close', ReturnType<typeof setTimeout>>
>

/**
 * State machine behind the warp. Mouse: hover the sticker (with intent
 * delay) to open; moving away starts the dissolve immediately.
 * Touch/keyboard: click toggles a "pinned" open that dismisses on
 * tap-anywhere, Escape, or a timer.
 */
export function useSmashWarp() {
  const reduce = useReducedMotion()
  const [state, setState] = useState<WarpState>({
    phase: 'closed',
    mode: 'hover',
  })
  const stateRef = useRef(state)
  stateRef.current = state
  const timers = useRef<Timers>({})
  const lastPointer = useRef('mouse')

  const clear = useCallback((...keys: Array<keyof Timers>) => {
    for (const key of keys) {
      clearTimeout(timers.current[key])
      delete timers.current[key]
    }
  }, [])
  const after = useCallback((key: keyof Timers, ms: number, fn: () => void) => {
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(fn, ms)
  }, [])

  const close = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'closed' || s.phase === 'closing') return
    clear('intent', 'auto', 'phase')
    setState({ phase: 'closing', mode: s.mode })
    after('close', reduce ? 40 : DISSOLVE_MS, () =>
      setState({ phase: 'closed', mode: s.mode }),
    )
  }, [after, clear, reduce])

  const open = useCallback(
    (mode: WarpMode) => {
      const s = stateRef.current
      if (s.phase === 'closing') return // let the dissolve finish
      if (s.phase !== 'closed') {
        // a tap while hover-open pins it (and arms the auto-dismiss)
        if (mode === 'pinned' && s.mode === 'hover') {
          setState({ phase: s.phase, mode: 'pinned' })
          after('auto', AUTO_CLOSE_MS, close)
        }
        return
      }
      setState({ phase: 'opening', mode })
      after('phase', reduce ? 40 : FILL_MS, () =>
        setState((prev) =>
          prev.phase === 'opening' ? { ...prev, phase: 'open' } : prev,
        ),
      )
      if (mode === 'pinned') after('auto', AUTO_CLOSE_MS, close)
    },
    [after, close, reduce],
  )

  // Escape always works while it's up
  useEffect(() => {
    if (state.phase === 'closed') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, close])

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const t of Object.values(pending)) clearTimeout(t)
    }
  }, [])

  const triggerProps = {
    'aria-expanded': state.phase !== 'closed',
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return
      if (stateRef.current.phase === 'closed') {
        after('intent', INTENT_MS, () => open('hover'))
      }
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return
      clear('intent')
      const s = stateRef.current
      if (s.mode !== 'hover' || s.phase === 'closed' || s.phase === 'closing')
        return
      close()
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      lastPointer.current = event.pointerType
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      // mouse users are served by hover; touch and keyboard (detail 0) toggle
      if (event.detail !== 0 && lastPointer.current === 'mouse') return
      if (stateRef.current.phase === 'closed') open('pinned')
      else close()
    },
  }

  return { state, close, triggerProps }
}

/* Fisher–Yates: each cell gets its slot in the fill order + a space tone. */
function shuffledCells() {
  const order = Array.from({ length: CELLS }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order.map((slot) => ({
    slot,
    color: FIELD[Math.floor(Math.random() * FIELD.length)],
  }))
}

/** Mounts fresh on every open, so the wipe never repeats a pattern. */
function PixelGrid() {
  const [cells] = useState(shuffledCells)
  return (
    <div className="smash-pixels">
      {cells.map((cell, i) => (
        <div
          key={i}
          className="smash-pixel"
          style={{ '--i': cell.slot, '--c': cell.color } as CSSProperties}
        />
      ))}
    </div>
  )
}

/**
 * Full-screen match, portalled to <body> so no transformed ancestor (the
 * sticker's own tumble-in) can break its fixed positioning. Decorative:
 * hidden from assistive tech; the trigger button carries the label.
 */
export function SmashWarp({
  state,
  onDismiss,
}: {
  state: WarpState
  onDismiss: () => void
}) {
  if (state.phase === 'closed' || typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-hidden
      className="smash-warp"
      data-state={state.phase}
      data-mode={state.mode}
      onClick={state.mode === 'pinned' ? onDismiss : undefined}
    >
      <PixelGrid />

      <div className="smash-world">
        <div className="smash-scenery">
          <div className="smash-glow" />
          <div className="smash-stage" />
          {PLATFORMS.map((p, i) => (
            <div key={i} className="smash-platform" style={p} />
          ))}
        </div>

        <span className="smash-timer">{COPY.timer}</span>

        <div className="smash-center">
          <p className="smash-eyebrow">
            <span>{COPY.eyebrow}</span>
          </p>
          <h2 className="smash-title">{COPY.title}</h2>
          <div className="smash-textbox">
            <p className="smash-body">{COPY.body}</p>
            <p className="smash-inv-label">{COPY.rulesLabel}</p>
            <ul className="smash-inv">
              {COPY.rules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="smash-cont">▼</span>
          </div>
        </div>

        <div className="smash-hud">
          {COPY.players.map((p, i) => (
            <div key={p.tag} className="smash-player">
              <span
                className={
                  p.hot ? 'smash-damage smash-damage-hot' : 'smash-damage'
                }
              >
                {p.damage}
              </span>
              <span
                className={i === 0 ? 'smash-tag' : 'smash-tag smash-tag-p2'}
              >
                {p.tag}
              </span>
              <span className="smash-stocks">
                {[0, 1, 2].map((s) => (
                  <span
                    key={s}
                    className={
                      s < p.stocks
                        ? 'smash-stock'
                        : 'smash-stock smash-stock-lost'
                    }
                  />
                ))}
              </span>
            </div>
          ))}
        </div>

        <p className="smash-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>
    </div>,
    document.body,
  )
}
