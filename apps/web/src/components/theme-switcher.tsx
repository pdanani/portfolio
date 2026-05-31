import { useState } from 'react'
import { KITS } from '#/lib/kits'
import { useKit } from '#/lib/kit-context'

/**
 * Floating dev tool to flip between theme kits live — each swaps the whole hero
 * concept (layout + colors + type). Temporary: once a kit is locked in, remove this.
 */
export function ThemeSwitcher() {
  const { kit, setKit } = useKit()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open && (
        <div className="surface mb-2 flex max-h-[75vh] w-64 flex-col p-2">
          <div className="flex shrink-0 items-center justify-between px-2 pb-2 pt-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Theme kit
            </span>
            <a
              href="/styleguide"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-cyan hover:underline"
            >
              style guide →
            </a>
          </div>
          <div className="flex min-h-0 flex-col gap-1 overflow-y-auto pr-1">
            {KITS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKit(k.id)}
                className={`flex items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-accent ${
                  kit === k.id ? 'ring-1 ring-ring' : ''
                }`}
              >
                <span
                  className="size-4 shrink-0 rounded-full border border-border"
                  style={{ background: k.swatch }}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{k.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {k.blurb}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="surface ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <span className="size-3 rounded-full" style={{ background: 'var(--primary)' }} />
        Theme
      </button>
    </div>
  )
}
