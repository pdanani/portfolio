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
  { id: 'midnight', label: 'Neon Green', blurb: 'Neon HUD · green', swatch: 'oklch(0.84 0.22 145)', mode: 'dark' },
  { id: 'neonred', label: 'Neon Red', blurb: 'Neon HUD · red', swatch: 'oklch(0.62 0.25 25)', mode: 'dark' },
  { id: 'monolux', label: 'Monochrome', blurb: 'Near-black luxe minimal', swatch: 'oklch(0.93 0.006 95)', mode: 'dark' },
  { id: 'blueprint', label: 'Blueprint', blurb: 'Technical drawing · grid', swatch: 'oklch(0.78 0.13 215)', mode: 'dark' },
  { id: 'bento', label: 'Bento', blurb: 'Modern dashboard grid', swatch: 'oklch(0.72 0.13 195)', mode: 'dark' },
  { id: 'frost', label: 'Frost', blurb: 'Light frosted glass', swatch: 'oklch(0.58 0.13 244)', mode: 'light' },
  { id: 'swiss', label: 'Swiss', blurb: 'Intl. typographic grid', swatch: 'oklch(0.55 0.2 27)', mode: 'light' },
  { id: 'pixel', label: 'Pixel', blurb: '8/16-bit retro game UI', swatch: 'oklch(0.84 0.16 85)', mode: 'dark' },
  { id: 'mario', label: 'Mario', blurb: 'Platformer homage · sky/blocks', swatch: 'oklch(0.58 0.21 27)', mode: 'light' },
  { id: 'zelda', label: 'Zelda', blurb: '16-bit overworld quest', swatch: 'oklch(0.55 0.13 145)', mode: 'dark' },
  { id: 'starwars', label: 'Star Wars', blurb: 'Opening crawl · starfield', swatch: 'oklch(0.82 0.15 90)', mode: 'dark' },
  { id: 'pokemon', label: 'Pokémon', blurb: 'Overworld town · explore', swatch: '#3aa655', mode: 'light' },
  { id: 'sonic', label: 'Sonic', blurb: 'Green-hill speed zone', swatch: 'oklch(0.56 0.19 250)', mode: 'light' },
  { id: 'jukebox', label: 'Jukebox', blurb: 'Retro diner jukebox + neon', swatch: 'oklch(0.66 0.26 350)', mode: 'dark' },
  { id: 'noirneon', label: 'Neo-Noir Neon', blurb: 'Rainy neon night city', swatch: 'oklch(0.68 0.27 4)', mode: 'dark' },
  { id: 'noir', label: 'Neo-Noir Mono', blurb: 'B&W film-noir drama', swatch: 'oklch(0.09 0 0)', mode: 'dark' },
  { id: 'aurora', label: 'Aurora Violet', blurb: 'Violet/cyan glass', swatch: 'oklch(0.7 0.19 292)', mode: 'dark' },
  { id: 'terminal', label: 'Terminal', blurb: 'Mono · phosphor green', swatch: 'oklch(0.82 0.22 145)', mode: 'dark' },
  { id: 'cyber', label: 'Cyber Neon (v1)', blurb: 'Original neon trio', swatch: 'oklch(0.7 0.27 330)', mode: 'dark' },
  { id: 'editorial', label: 'Editorial', blurb: 'Light · serif · minimal', swatch: 'oklch(0.45 0.13 25)', mode: 'light' },
  { id: 'brutalist', label: 'Brutalist', blurb: 'Stark · thick borders', swatch: 'oklch(0.55 0.25 265)', mode: 'light' },
  { id: 'sunset', label: 'Sunset', blurb: 'Warm · amber/rose', swatch: 'oklch(0.72 0.18 45)', mode: 'dark' },
]

export const DEFAULT_KIT = 'aurora'
export const KIT_STORAGE_KEY = 'kit'
