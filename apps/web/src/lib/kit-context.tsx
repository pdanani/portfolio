import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_KIT, KIT_STORAGE_KEY } from '#/lib/kits'

interface KitContextValue {
  kit: string
  setKit: (id: string) => void
}

const KitContext = createContext<KitContextValue>({
  kit: DEFAULT_KIT,
  setKit: () => {},
})

/**
 * Holds the active theme kit and shares it between the switcher and the page
 * (so kits can swap the whole layout, not just colors). SSR renders the
 * default; the saved kit is applied on mount (and pre-paint by a script in
 * __root) to keep hydration consistent.
 */
export function KitProvider({ children }: { children: ReactNode }) {
  const [kit, setKitState] = useState(DEFAULT_KIT)

  useEffect(() => {
    const stored = localStorage.getItem(KIT_STORAGE_KEY)
    if (stored) setKitState(stored)
  }, [])

  function setKit(id: string) {
    setKitState(id)
    document.documentElement.setAttribute('data-kit', id)
    try {
      localStorage.setItem(KIT_STORAGE_KEY, id)
    } catch {
      // ignore (private mode, storage disabled, etc.)
    }
  }

  return <KitContext.Provider value={{ kit, setKit }}>{children}</KitContext.Provider>
}

export function useKit() {
  return useContext(KitContext)
}
