import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'

export type WarpMode = 'hover' | 'pinned'
export type WarpPhase = 'closed' | 'opening' | 'open' | 'closing'
export interface WarpState {
  phase: WarpPhase
  mode: WarpMode
  /** Viewport centre of the trigger when it opened — wipes start there. */
  origin: { x: number; y: number }
}

/** Hover intent, so brushing past a sticker doesn't fire it. */
const INTENT_MS = 220
/** Opened by tap: dismiss on its own if nobody taps again. */
const AUTO_CLOSE_MS = 7000

type Timers = Partial<
  Record<'intent' | 'auto' | 'phase' | 'close', ReturnType<typeof setTimeout>>
>

/**
 * State machine shared by the sticker easter eggs. Mouse: hover the sticker
 * (with intent delay) to open; moving away starts the exit at once.
 * Touch/keyboard: click toggles a "pinned" open that dismisses on
 * tap-anywhere, Escape, or a timer. `fill` is how long the entrance runs
 * before the scene counts as open; `dissolve` how long the exit takes
 * before unmount.
 */
export function useWarp({
  fill,
  dissolve,
}: {
  fill: number
  dissolve: number
}) {
  const reduce = useReducedMotion()
  const [state, setState] = useState<WarpState>({
    phase: 'closed',
    mode: 'hover',
    origin: { x: 0, y: 0 },
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
    setState({ ...s, phase: 'closing' })
    after('close', reduce ? 40 : dissolve, () =>
      setState((prev) => ({ ...prev, phase: 'closed' })),
    )
  }, [after, clear, dissolve, reduce])

  const open = useCallback(
    (mode: WarpMode, el: HTMLElement) => {
      const s = stateRef.current
      if (s.phase === 'closing') return // let the exit finish
      if (s.phase !== 'closed') {
        // a tap while hover-open pins it (and arms the auto-dismiss)
        if (mode === 'pinned' && s.mode === 'hover') {
          setState({ ...s, mode: 'pinned' })
          after('auto', AUTO_CLOSE_MS, close)
        }
        return
      }
      const r = el.getBoundingClientRect()
      setState({
        phase: 'opening',
        mode,
        origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
      })
      after('phase', reduce ? 40 : fill, () =>
        setState((prev) =>
          prev.phase === 'opening' ? { ...prev, phase: 'open' } : prev,
        ),
      )
      if (mode === 'pinned') after('auto', AUTO_CLOSE_MS, close)
    },
    [after, close, fill, reduce],
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
      const el = event.currentTarget
      if (stateRef.current.phase === 'closed') {
        after('intent', INTENT_MS, () => open('hover', el))
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
      if (stateRef.current.phase === 'closed')
        open('pinned', event.currentTarget)
      else close()
    },
  }

  return { state, close, triggerProps }
}
