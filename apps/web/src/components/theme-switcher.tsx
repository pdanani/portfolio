import { useEffect, useState } from 'react'
import { DEFAULT_KIT, KIT_STORAGE_KEY, KITS } from '#/lib/kits'

/**
 * Floating dev tool to flip between theme kits live. Persists the choice to
 * localStorage; a no-flash script in __root applies it before paint.
 * Temporary — once a kit is locked in, this can be removed.
 */
export function ThemeSwitcher() {
  const [kit, setKit] = useState(DEFAULT_KIT)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(KIT_STORAGE_KEY)
    if (stored) setKit(stored)
  }, [])

  function choose(id: string) {
    setKit(id)
    document.documentElement.setAttribute('data-kit', id)
    try {
      localStorage.setItem(KIT_STORAGE_KEY, id)
    } catch {
      // ignore (private mode, storage disabled, etc.)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open && (
        <div className="surface mb-2 w-64 p-2">
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
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
          <div className="flex flex-col gap-1">
            {KITS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => choose(k.id)}
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
