import type { ComponentType } from 'react'
import { AuroraHero } from './aurora-hero'
import { TerminalHero } from './terminal-hero'
import { EditorialHero } from './editorial-hero'
import { BrutalistHero } from './brutalist-hero'
import { CyberHero } from './cyber-hero'
import { SunsetHero } from './sunset-hero'

/** Maps a kit id → its bespoke hero concept (distinct layout, not just colors). */
export const CONCEPTS: Record<string, ComponentType> = {
  aurora: AuroraHero,
  terminal: TerminalHero,
  editorial: EditorialHero,
  brutalist: BrutalistHero,
  cyber: CyberHero,
  sunset: SunsetHero,
}
