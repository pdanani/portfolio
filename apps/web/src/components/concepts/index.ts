import type { ComponentType } from 'react'
import { MidnightHero } from './midnight-hero'
import { MonoluxHero } from './monolux-hero'
import { BlueprintHero } from './blueprint-hero'
import { BentoHero } from './bento-hero'
import { FrostHero } from './frost-hero'
import { SwissHero } from './swiss-hero'
import { PixelHero } from './pixel-hero'
import { MarioHero } from './mario-hero'
import { ZeldaHero } from './zelda-hero'
import { StarWarsHero } from './starwars-hero'
import { PokemonHero } from './pokemon-hero'
import { SonicHero } from './sonic-hero'
import { AuroraHero } from './aurora-hero'
import { TerminalHero } from './terminal-hero'
import { CyberHero } from './cyber-hero'
import { EditorialHero } from './editorial-hero'
import { BrutalistHero } from './brutalist-hero'
import { SunsetHero } from './sunset-hero'

/** Maps a kit id → its bespoke hero concept (distinct layout, not just colors). */
export const CONCEPTS: Record<string, ComponentType> = {
  midnight: MidnightHero,
  monolux: MonoluxHero,
  blueprint: BlueprintHero,
  bento: BentoHero,
  frost: FrostHero,
  swiss: SwissHero,
  pixel: PixelHero,
  mario: MarioHero,
  zelda: ZeldaHero,
  starwars: StarWarsHero,
  pokemon: PokemonHero,
  sonic: SonicHero,
  aurora: AuroraHero,
  terminal: TerminalHero,
  cyber: CyberHero,
  editorial: EditorialHero,
  brutalist: BrutalistHero,
  sunset: SunsetHero,
}
