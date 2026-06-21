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
  { id: 'vinyl', label: 'Vinyl', blurb: 'Spinning record player', swatch: 'oklch(0.78 0.15 65)', mode: 'dark' },
  { id: 'zelda', label: 'Zelda', blurb: '16-bit overworld quest', swatch: 'oklch(0.55 0.13 145)', mode: 'dark' },
  { id: 'mario', label: 'Mario', blurb: 'Platformer homage · sky/blocks', swatch: 'oklch(0.58 0.21 27)', mode: 'light' },
  { id: 'waves', label: 'Ocean Waves', blurb: 'Realistic moving water (WebGL)', swatch: '#1a2a4d', mode: 'dark' },
  { id: 'waves8bit', label: 'Waves 8-Bit', blurb: 'Pixel-art ocean', swatch: '#1b6fd6', mode: 'dark' },
  { id: 'convenience', label: 'Floating Mart', blurb: 'Lit store on water + ripple reflection', swatch: 'oklch(0.64 0.24 22)', mode: 'dark' },
  { id: 'space', label: 'Deep Space', blurb: 'Tasteful animated cosmos: a parallax starfield, a slowly rotating amber gas giant with a tilted orbiting ring and moon, and a drifting nebula.', swatch: '#0a0b1a', mode: 'dark' },
  { id: 'midnight', label: 'Neon Sign', blurb: 'Neon bar sign · pick a color', swatch: 'oklch(0.84 0.22 145)', mode: 'dark' },
  { id: 'monolux', label: 'Monochrome', blurb: 'Near-black luxe minimal', swatch: 'oklch(0.93 0.006 95)', mode: 'dark' },
  // { id: 'blueprint', label: 'Blueprint', blurb: 'Technical drawing · grid', swatch: 'oklch(0.78 0.13 215)', mode: 'dark' },
  // { id: 'bento', label: 'Bento', blurb: 'Modern dashboard grid', swatch: 'oklch(0.72 0.13 195)', mode: 'dark' },
  { id: 'frost', label: 'Frost', blurb: 'Light frosted glass', swatch: 'oklch(0.58 0.13 244)', mode: 'light' },
  { id: 'swiss', label: 'Swiss', blurb: 'Intl. typographic grid', swatch: 'oklch(0.55 0.2 27)', mode: 'light' },
  { id: 'pixel', label: 'Pixel', blurb: '8/16-bit retro game UI', swatch: 'oklch(0.84 0.16 85)', mode: 'dark' },
  // { id: 'starwars', label: 'Blue & Yellow', blurb: 'Command HUD · blue/gold', swatch: 'oklch(0.82 0.15 90)', mode: 'dark' },
  { id: 'pokemon', label: 'Pokémon', blurb: 'Overworld town · explore', swatch: '#3aa655', mode: 'light' },
  { id: 'sonic', label: 'Sonic', blurb: 'Green-hill speed zone', swatch: 'oklch(0.56 0.19 250)', mode: 'light' },
  // { id: 'jukebox', label: 'Jukebox', blurb: 'Retro diner jukebox + neon', swatch: 'oklch(0.66 0.26 350)', mode: 'dark' },
  { id: 'jukebox2', label: 'Jukebox II', blurb: 'Wurlitzer deluxe · bubble tubes', swatch: '#e8408f', mode: 'dark' },
  // { id: 'csgo', label: 'CS:GO Dust II', blurb: 'FPS HUD · de_dust2', swatch: 'oklch(0.7 0.13 230)', mode: 'dark' },
  // { id: 'csgo2', label: 'CS:GO Scoreboard', blurb: 'Match MVP scoreboard', swatch: '#0e1620', mode: 'dark' },
  // { id: 'noirneon', label: 'Neo-Noir Neon', blurb: 'Rainy neon night city', swatch: 'oklch(0.68 0.27 4)', mode: 'dark' },
  { id: 'noir', label: 'Neo-Noir Mono', blurb: 'B&W film-noir drama', swatch: 'oklch(0.09 0 0)', mode: 'dark' },
  // { id: 'aurora', label: 'Aurora Violet', blurb: 'Violet/cyan glass', swatch: 'oklch(0.7 0.19 292)', mode: 'dark' },
  { id: 'terminal', label: 'Terminal', blurb: 'Mono · phosphor green', swatch: 'oklch(0.82 0.22 145)', mode: 'dark' },
  { id: 'cyber', label: 'Cyber Neon (v1)', blurb: 'Original neon trio', swatch: 'oklch(0.7 0.27 330)', mode: 'dark' },
  { id: 'editorial', label: 'Editorial', blurb: 'Light · serif · minimal', swatch: 'oklch(0.45 0.13 25)', mode: 'light' },
  { id: 'brutalist', label: 'Brutalist', blurb: 'Stark · thick borders', swatch: 'oklch(0.55 0.25 265)', mode: 'light' },
  // { id: 'sunset', label: 'Sunset', blurb: 'Warm · amber/rose', swatch: 'oklch(0.72 0.18 45)', mode: 'dark' },
]

export const DEFAULT_KIT = 'midnight'
export const KIT_STORAGE_KEY = 'kit'
