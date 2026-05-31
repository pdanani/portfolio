export interface Kit {
  id: string
  label: string
  blurb: string
  /** A representative color (the kit's primary) for the switcher dot. */
  swatch: string
  mode: 'dark' | 'light'
}

/**
 * Theme "kits" — each is a full set of token overrides in styles.css under
 * `:root[data-kit="<id>"]` and a bespoke hero concept in components/concepts.
 */
export const KITS: Array<Kit> = [
  { id: 'midnight', label: 'Midnight', blurb: 'Refined neon · cohesive', swatch: 'oklch(0.72 0.15 240)', mode: 'dark' },
  { id: 'monolux', label: 'Monochrome', blurb: 'Near-black luxe minimal', swatch: 'oklch(0.93 0.006 95)', mode: 'dark' },
  { id: 'blueprint', label: 'Blueprint', blurb: 'Technical drawing · grid', swatch: 'oklch(0.78 0.13 215)', mode: 'dark' },
  { id: 'bento', label: 'Bento', blurb: 'Modern dashboard grid', swatch: 'oklch(0.72 0.13 195)', mode: 'dark' },
  { id: 'frost', label: 'Frost', blurb: 'Light frosted glass', swatch: 'oklch(0.58 0.13 244)', mode: 'light' },
  { id: 'swiss', label: 'Swiss', blurb: 'Intl. typographic grid', swatch: 'oklch(0.55 0.2 27)', mode: 'light' },
  { id: 'pixel', label: 'Pixel', blurb: '8/16-bit retro game UI', swatch: 'oklch(0.84 0.16 85)', mode: 'dark' },
  { id: 'mario', label: 'Mario', blurb: 'Platformer homage · sky/blocks', swatch: 'oklch(0.58 0.21 27)', mode: 'light' },
  { id: 'arcade', label: 'Arcade', blurb: 'Full-screen retro arcade', swatch: 'oklch(0.78 0.16 215)', mode: 'dark' },
  { id: 'zelda', label: 'Zelda', blurb: '16-bit overworld quest', swatch: 'oklch(0.55 0.13 145)', mode: 'dark' },
  { id: 'aurora', label: 'Aurora Violet', blurb: 'Violet/cyan glass', swatch: 'oklch(0.7 0.19 292)', mode: 'dark' },
  { id: 'terminal', label: 'Terminal', blurb: 'Mono · phosphor green', swatch: 'oklch(0.82 0.22 145)', mode: 'dark' },
  { id: 'cyber', label: 'Cyber Neon (v1)', blurb: 'Original neon trio', swatch: 'oklch(0.7 0.27 330)', mode: 'dark' },
  { id: 'editorial', label: 'Editorial', blurb: 'Light · serif · minimal', swatch: 'oklch(0.45 0.13 25)', mode: 'light' },
  { id: 'brutalist', label: 'Brutalist', blurb: 'Stark · thick borders', swatch: 'oklch(0.55 0.25 265)', mode: 'light' },
  { id: 'sunset', label: 'Sunset', blurb: 'Warm · amber/rose', swatch: 'oklch(0.72 0.18 45)', mode: 'dark' },
]

export const DEFAULT_KIT = 'aurora'
export const KIT_STORAGE_KEY = 'kit'
