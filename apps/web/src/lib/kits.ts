export interface Kit {
  id: string
  label: string
  blurb: string
  /** A representative color (the kit's primary) for the switcher dot. */
  swatch: string
  mode: 'dark' | 'light'
}

/**
 * Theme "kits" — each is a full set of token overrides defined in styles.css
 * under `:root[data-kit="<id>"]`. The default (aurora) needs no block.
 */
export const KITS: Array<Kit> = [
  { id: 'aurora', label: 'Aurora Violet', blurb: 'Violet/cyan glass', swatch: 'oklch(0.7 0.19 292)', mode: 'dark' },
  { id: 'terminal', label: 'Terminal', blurb: 'Mono · phosphor green', swatch: 'oklch(0.82 0.22 145)', mode: 'dark' },
  { id: 'cyber', label: 'Cyber Neon', blurb: 'Magenta · cyan · lime', swatch: 'oklch(0.7 0.27 330)', mode: 'dark' },
  { id: 'editorial', label: 'Editorial', blurb: 'Light · serif · minimal', swatch: 'oklch(0.45 0.13 25)', mode: 'light' },
  { id: 'brutalist', label: 'Brutalist', blurb: 'Stark · thick borders', swatch: 'oklch(0.55 0.25 265)', mode: 'light' },
  { id: 'sunset', label: 'Sunset', blurb: 'Warm · amber/rose', swatch: 'oklch(0.72 0.18 45)', mode: 'dark' },
]

export const DEFAULT_KIT = 'aurora'
export const KIT_STORAGE_KEY = 'kit'
