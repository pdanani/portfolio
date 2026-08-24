import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'motion/react'

/* Everything the overlay says, in one place. */
const COPY = {
  eyebrow: 'Secret found · Gaming',
  title: "It's dangerous to go alone!",
  body: 'So when the laptop closes, Pawan heads to Hyrule. The Legend of Zelda — favourite series, no contest.',
  inventory: ['Master Sword', 'Hylian Shield', 'Ocarina', 'Hookshot'],
  hintHover: 'move away to return',
  hintTap: 'tap anywhere to return',
}

/** 24 × 14 on desktop, 12 × 28 on phones — same count either way. */
const CELLS = 336
/** Mosaic fill; the overworld fades in once it's done. */
const FILL_MS = 620
const DISSOLVE_MS = 560
/** Hover intent, so brushing past the sticker doesn't fire it. */
const INTENT_MS = 220
/** Once open by hover, stay at least this long even if the pointer slips. */
const MIN_SHOW_MS = 1800
/** Opened by tap: dismiss on its own if nobody taps again. */
const AUTO_CLOSE_MS = 7000

/* Meadow greens for the mosaic — it stays as the ground of the overworld. */
const FIELD = [
  'oklch(0.5 0.1 147)',
  'oklch(0.46 0.09 150)',
  'oklch(0.54 0.11 145)',
  'oklch(0.43 0.09 152)',
]

type Spot = { top: string; left?: string; right?: string }
const TREES: Array<Spot> = [
  { top: '16%', left: '8%' },
  { top: '62%', left: '12%' },
  { top: '24%', right: '10%' },
  { top: '70%', right: '14%' },
  { top: '46%', left: '4%' },
]
const ROCKS: Array<Spot> = [
  { top: '34%', left: '20%' },
  { top: '78%', left: '30%' },
  { top: '18%', right: '24%' },
]

export type WarpMode = 'hover' | 'pinned'
export type WarpPhase = 'closed' | 'opening' | 'open' | 'closing'
export interface WarpState {
  phase: WarpPhase
  mode: WarpMode
}

type Timers = Partial<
  Record<
    'intent' | 'minShow' | 'auto' | 'phase' | 'close',
    ReturnType<typeof setTimeout>
  >
>

/**
 * State machine behind the warp. Mouse: hover the sticker (with intent
 * delay) to open, move away to close — with a minimum on-screen time so a
 * slipped pointer doesn't cut it short. Touch/keyboard: click toggles a
 * "pinned" open that dismisses on tap-anywhere, Escape, or a timer.
 */
export function useZeldaWarp() {
  const reduce = useReducedMotion()
  const [state, setState] = useState<WarpState>({
    phase: 'closed',
    mode: 'hover',
  })
  const stateRef = useRef(state)
  stateRef.current = state
  const timers = useRef<Timers>({})
  const openedAt = useRef(0)
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
    clear('intent', 'minShow', 'auto', 'phase')
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
      openedAt.current = Date.now()
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
      clear('minShow')
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
      after(
        'minShow',
        Math.max(0, MIN_SHOW_MS - (Date.now() - openedAt.current)),
        close,
      )
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

/* Fisher–Yates: each cell gets its slot in the fill order + a meadow tone. */
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
    <div className="zelda-pixels">
      {cells.map((cell, i) => (
        <div
          key={i}
          className="zelda-pixel"
          style={{ '--i': cell.slot, '--c': cell.color } as CSSProperties}
        />
      ))}
    </div>
  )
}

/**
 * Full-screen Hyrule, portalled to <body> so no transformed ancestor (the
 * sticker's own tumble-in) can break its fixed positioning. Decorative:
 * hidden from assistive tech; the trigger button carries the label.
 */
export function ZeldaWarp({
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
      className="zelda-warp"
      data-state={state.phase}
      data-mode={state.mode}
      onClick={state.mode === 'pinned' ? onDismiss : undefined}
    >
      <PixelGrid />

      <div className="zelda-world">
        <div className="zelda-scenery">
          <div className="zelda-path" />
          {TREES.map((t, i) => (
            <div key={i} className="zelda-tree" style={t} />
          ))}
          {ROCKS.map((r, i) => (
            <div key={i} className="zelda-rock" style={r} />
          ))}
          <div className="zelda-pond" style={{ bottom: '9%', left: '6%' }} />
        </div>

        <div className="zelda-hud">
          <div>
            <span className="zelda-emblem" />
            <span className="zelda-hud-label">Side quest</span>
          </div>
          <div>
            {[false, false, false, true].map((empty, i) => (
              <span
                key={i}
                className={
                  empty ? 'zelda-heart zelda-heart-empty' : 'zelda-heart'
                }
              />
            ))}
          </div>
          <div className="zelda-rupees">
            <span className="zelda-gem" />
            <span>x255</span>
          </div>
        </div>

        <div className="zelda-center">
          <p className="zelda-eyebrow">
            <span>{COPY.eyebrow}</span>
          </p>
          <h2 className="zelda-title">{COPY.title}</h2>
          <div className="zelda-textbox">
            <p className="zelda-body">{COPY.body}</p>
            <p className="zelda-inv-label">Inventory</p>
            <ul className="zelda-inv">
              {COPY.inventory.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="zelda-cont">▼</span>
          </div>
        </div>

        <p className="zelda-hint">
          ▼ {state.mode === 'hover' ? COPY.hintHover : COPY.hintTap}
        </p>
      </div>
    </div>,
    document.body,
  )
}
