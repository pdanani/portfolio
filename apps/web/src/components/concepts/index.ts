import type { ComponentType } from 'react'
import { NeonSignHero } from './neonsign-hero'
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
import { JukeboxHero } from './jukebox-hero'
import { CsgoHero } from './csgo-hero'
import { CsgoTwoHero } from './csgo2-hero'
import { JukeboxDeluxeHero } from './jukebox2-hero'
import { VinylHero } from './vinyl-hero'
import { WavesHero } from './waves-hero'
import { NoirNeonHero } from './noirneon-hero'
import { NoirHero } from './noir-hero'
import { AuroraHero } from './aurora-hero'
import { TerminalHero } from './terminal-hero'
import { CyberHero } from './cyber-hero'
import { EditorialHero } from './editorial-hero'
import { BrutalistHero } from './brutalist-hero'
import { SunsetHero } from './sunset-hero'

/** Maps a kit id → its bespoke hero concept (distinct layout, not just colors). */
export const CONCEPTS: Record<string, ComponentType> = {
  midnight: NeonSignHero,
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
  jukebox: JukeboxHero,
  csgo: CsgoHero,
  csgo2: CsgoTwoHero,
  jukebox2: JukeboxDeluxeHero,
  vinyl: VinylHero,
  waves: WavesHero,
  noirneon: NoirNeonHero,
  noir: NoirHero,
  aurora: AuroraHero,
  terminal: TerminalHero,
  cyber: CyberHero,
  editorial: EditorialHero,
  brutalist: BrutalistHero,
  sunset: SunsetHero,
}
