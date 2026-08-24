import { useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useWarp } from './warp'
import type { WarpState } from './warp'

/* Everything the overlay says, in one place. */
const COPY = {
  eyebrow: 'Sidequest',
  title: 'A wild Pawan appeared!',
  body: 'Off the clock you’ll find him out on a route somewhere, catching them all — with a detour to Hyrule now and then.',
  bagLabel: 'Bag',
  inventory: ['Poké Ball', 'Potion', 'Bicycle', 'Running Shoes'],
  hintHover: 'move away to return',
  hintTap: 'tap anywhere to return',
}

/** 24 × 14 on desktop, 12 × 28 on phones — same count either way. */
const CELLS = 336
/** Mosaic fill; the overworld fades in once it's done. */
const FILL_MS = 620
const DISSOLVE_MS = 340

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

/** The Gaming sticker's state: mosaic fill, then a quick dissolve. */
export function useZeldaWarp() {
  return useWarp({ fill: FILL_MS, dissolve: DISSOLVE_MS })
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
            <span className="zelda-hud-label">Route 1</span>
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
            <p className="zelda-inv-label">{COPY.bagLabel}</p>
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
