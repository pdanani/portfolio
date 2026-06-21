import { useId } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'
import { OceanShader } from './ocean-shader'

/**
 * Floating Mart II — a grittier, semi-photographic take on the real "GLOBAL
 * CONVENIENCE" floating store on Lake Ontario, drawn at a 3/4 angle at dusk.
 *
 * The whole structure (dock + store + front-deck clutter) is built once as
 * `StoreScene` in scene-space so the water reflection can re-use it: the
 * reflected copy is flipped about the waterline, pushed through a STATIC
 * feTurbulence/feDisplacementMap (calm water — no looping baseFrequency animation),
 * fade-masked downward, and doubled by a vertically-smeared, screen-blended
 * "light streak" layer (`Emitters`) so the red banner, the pink OPEN neon, the
 * blue ATM neon and the warm windows bleed into the lake as broken colour
 * streaks. A faint feTurbulence grain sits over the upright store to break up
 * the vector-smoothness. Only the overlay text fades in on mount; the reflection
 * sway is a GPU CSS transform — both gated on reduced-motion.
 *
 * Sky + sea come from <OceanShader/> behind this transparent SVG (its horizon is
 * at uv.y=0.30, i.e. the waterline sits ~70% down the viewport). The dock is
 * seated on that line via the .convenience2-store positioning transform.
 */
export function Convenience2Hero() {
  const reduce = useReducedMotion()

  // Unique ids so multiple instances never collide on filter/gradient defs.
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `c2-${name}-${uid}`

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  // ---- ids (declared once, threaded into the SVG defs + url() refs) ----
  const brickFill = id('brick')
  const brickShade = id('brickShade')
  const brickStreak = id('brickStreak')
  const roofGrad = id('roof')
  const sideRoof = id('sideRoof')
  const winGlow = id('winGlow')
  const winGlowSoft = id('winGlowSoft')
  const interior = id('interior')
  const interiorDeep = id('interiorDeep')
  const glassSheen = id('glassSheen')
  const bannerL = id('bannerL')
  const bannerR = id('bannerR')
  const bannerSheen = id('bannerSheen')
  const dockTop = id('dockTop')
  const dockFace = id('dockFace')
  const dockSide = id('dockSide')
  const bumper = id('bumper')
  const hydrantGrad = id('hydrant')
  const canGrad = id('can')
  const spill = id('spill')
  const doorSpill = id('doorSpill')
  const softGlow = id('softGlow')
  const neonPink = id('neonPink')
  const neonBlue = id('neonBlue')
  const lampGlow = id('lampGlow')
  const ripple = id('ripple')
  const streakBlur = id('streakBlur')
  const grain = id('grain')
  const reflMask = id('reflMask')
  const streakMask = id('streakMask')
  const neonBlur = id('neonBlur')
  const buoyGrad = id('buoy')

  // Waterline (in viewBox units). The reflection mirrors about this line.
  // viewBox is "0 0 480 800" → waterline at y=500 → 62.5% down the SVG.
  const WATER_Y = 500
  const VB_H = 800
  const REFL_H = VB_H - WATER_Y

  // ---- shelf product silhouettes: rows of tiny colour boxes glowing in glass ----
  const tints = [
    '#ff6b5e', '#ffd166', '#6fd0ff', '#b6f36b', '#ff9ad4', '#ffb066',
    '#8ad4ff', '#ff8a5e', '#d6a0ff', '#9af3c0', '#ffe08a', '#ff5d8a',
  ]
  const products = (x: number, y: number, w: number, seed: number, key: string) => {
    const cols = Math.max(4, Math.round(w / 8))
    const cw = w / cols
    return (
      <g key={key}>
        {Array.from({ length: cols }).map((_, i) => {
          const h = 6 + ((i * 7 + seed) % 5) * 2
          const t = (i * 3 + seed) % tints.length
          return (
            <rect
              key={`${key}-${i}`}
              x={x + i * cw + 0.5}
              y={y - h}
              width={cw - 1}
              height={h}
              rx={0.8}
              fill={tints[t]}
              opacity={0.78 + ((i + seed) % 3) * 0.07}
            />
          )
        })}
      </g>
    )
  }

  // One lit plate-glass storefront pane: glowing interior, 4 packed shelves,
  // a thin aluminium muntin grid, a slight specular streak. Densely stocked.
  const windowPane = (x: number, y: number, w: number, h: number, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={`url(#${interior})`} />
      <rect x={x} y={y} width={w} height={h} rx={2} fill={`url(#${winGlow})`} opacity={0.5} />
      {/* dim deep-store shelves at the back */}
      <rect x={x + 2} y={y + 2} width={w - 4} height={h * 0.34} fill={`url(#${interiorDeep})`} opacity={0.5} />
      {products(x + 3, y + h * 0.34, w - 6, key.length + 1, `${key}-s1`)}
      {products(x + 3, y + h * 0.52, w - 6, key.length + 4, `${key}-s2`)}
      {products(x + 3, y + h * 0.7, w - 6, key.length + 9, `${key}-s3`)}
      {products(x + 3, y + h * 0.9, w - 6, key.length + 13, `${key}-s4`)}
      {/* shelf lines */}
      {[0.34, 0.52, 0.7, 0.9].map((f) => (
        <rect key={`${key}-sh-${f}`} x={x + 2} y={y + h * f} width={w - 4} height={1.3} fill="#2a1c10" opacity={0.55} />
      ))}
      {/* aluminium muntins */}
      <rect x={x + w / 3} y={y} width={1.6} height={h} fill="#cdd4dc" opacity={0.5} />
      <rect x={x + (2 * w) / 3} y={y} width={1.6} height={h} fill="#cdd4dc" opacity={0.5} />
      <rect x={x} y={y + h / 2} width={w} height={1.4} fill="#aab2bb" opacity={0.4} />
      {/* frame */}
      <rect x={x} y={y} width={w} height={h} rx={2} fill="none" stroke="#0c0a07" strokeWidth={2.4} />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={2} fill="none" stroke="#5a6168" strokeWidth={0.7} opacity={0.5} />
      {/* glass specular */}
      <path d={`M${x + 2} ${y + 2} L${x + w * 0.42} ${y + 2} L${x + 2} ${y + h * 0.5} Z`} fill="#ffffff" opacity={0.05} />
      <rect x={x} y={y} width={w} height={h} rx={2} fill={`url(#${glassSheen})`} opacity={0.16} />
    </g>
  )

  /**
   * The complete store + dock as a self-contained group, in scene-space.
   * Drawn upright once on top, and a second time (flipped) for the reflection.
   *
   * 3/4 GEOMETRY: front face spans x≈92..300 (faces us); the right side wall
   * recedes from x=300 (near, tall) to x≈392 (far, shorter/higher) — perspective.
   * Waterline is at y=500. Dock top deck ~y=452..500.
   */
  const StoreScene = (
    <g>
      {/* warm light spilled forward onto the dock deck */}
      <ellipse cx={236} cy={470} rx={186} ry={20} fill={`url(#${spill})`} />
      <ellipse cx={206} cy={476} rx={70} ry={13} fill={`url(#${doorSpill})`} />

      {/* ============ RIGHT SIDE WALL (receding, brick, 3/4) ============ */}
      <g>
        {/* wall plane: near edge x=300 (y 188..452), far edge x=392 (y 226..430) */}
        <polygon points="300,188 392,226 392,430 300,452" fill={`url(#${brickFill})`} />
        <polygon points="300,188 392,226 392,430 300,452" fill={`url(#${brickShade})`} opacity={0.92} />
        {/* brick courses — perspective-converging mortar lines */}
        {Array.from({ length: 22 }).map((_, r) => {
          const t = r / 22
          const yN = 188 + (452 - 188) * t
          const yF = 226 + (430 - 226) * t
          return (
            <g key={`bc-${r}`}>
              <line x1={300} y1={yN} x2={392} y2={yF} stroke="#160b07" strokeWidth={0.7} opacity={0.5} />
              {/* irregular vertical head joints, offset per row */}
              {Array.from({ length: 5 }).map((_, c) => {
                const off = (r % 2) * 0.5
                const f = (c + off) / 5
                const vx = 300 + 92 * f
                const vy = yN + (yF - yN) * f
                return (
                  <line
                    key={`bj-${r}-${c}`}
                    x1={vx}
                    y1={vy}
                    x2={vx}
                    y2={vy + (yN - yF >= 0 ? 12 : 12) * (1 - 0.35 * f)}
                    stroke="#160b07"
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                )
              })}
            </g>
          )
        })}
        {/* weathering streaks down the brick */}
        <rect x={300} y={188} width={92} height={264} fill={`url(#${brickStreak})`} opacity={0.5} />
        {[316, 338, 360, 378].map((wx, i) => (
          <line key={`weather-${wx}`} x1={wx} y1={210 + i * 6} x2={wx + 2} y2={430} stroke="#0c0604" strokeWidth={1.1} opacity={0.18} />
        ))}

        {/* ---- posters / signs on the brick ---- */}
        {/* FOOD CENTRE (green) */}
        <g transform="translate(312 250) skewY(9.6)">
          <rect x={0} y={0} width={34} height={16} rx={1.5} fill="#0c3a1c" stroke="#0a2a14" strokeWidth={1} />
          <rect x={0} y={0} width={34} height={4} fill="#1c6b34" />
          <text x={17} y={11.5} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={4} fontWeight={700} fill="#bff3c4">FOOD CENTRE</text>
        </g>
        {/* FRESH CUT FLOWERS */}
        <g transform="translate(314 282) skewY(9.6)">
          <rect x={0} y={0} width={36} height={14} rx={1.5} fill="#fbf0e0" stroke="#caa" strokeWidth={0.6} />
          <text x={18} y={6} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3} fontWeight={700} fill="#b3245a">FRESH CUT</text>
          <text x={18} y={11} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3.4} fontWeight={700} fill="#1c8a44">FLOWERS</text>
        </g>
        {/* ICE SOLD HERE */}
        <g transform="translate(316 312) skewY(9.6)">
          <rect x={0} y={0} width={32} height={15} rx={1.5} fill="#0d2a44" stroke="#0a1f33" strokeWidth={0.8} />
          <text x={16} y={7} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={4.4} fontWeight={700} fill="#9fe0ff">ICE</text>
          <text x={16} y={12} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={2.8} fontWeight={700} fill="#cfeaff">SOLD HERE</text>
        </g>

        {/* wall-mounted sconce lamp (upper right) with warm glow */}
        <g transform="translate(366 244) skewY(9.6)">
          <ellipse cx={6} cy={16} rx={18} ry={20} fill={`url(#${lampGlow})`} />
          <rect x={3} y={0} width={5} height={7} fill="#14100b" />
          <path d="M0 7 L11 7 L8 18 L3 18 Z" fill="#2a1c12" stroke="#0c0804" strokeWidth={0.6} />
          <ellipse cx={5.5} cy={18} rx={5} ry={2.6} fill="#ffe6b0" opacity={0.85} />
          <circle cx={5.5} cy={16} r={2} fill="#fff4d6" />
        </g>

        {/* security camera (corner) */}
        <g transform="translate(372 232) skewY(9.6)">
          <rect x={2} y={2} width={4} height={5} fill="#0a0805" />
          <rect x={-4} y={0} width={10} height={7} rx={2} fill="#16110c" stroke="#0a0805" strokeWidth={0.6} />
          <circle cx={-3} cy={3.4} r={1.8} fill="#080808" />
          <circle cx={-3.5} cy={2.9} r={0.55} fill="#7fff9a" />
        </g>

        {/* side roof slab */}
        <polygon points="300,182 392,220 392,226 300,188" fill={`url(#${sideRoof})`} />
      </g>

      {/* ============ ROOF (front slab + parapet + rooftop units) ============ */}
      <g>
        <polygon points="92,184 300,184 300,188 92,188" fill="#0a0c11" />
        <polygon points="92,176 300,176 308,184 84,184" fill={`url(#${roofGrad})`} />
        <rect x={84} y={172} width={224} height={8} rx={1.5} fill="#0b0d12" />
        <rect x={86} y={173} width={222} height={1.4} fill="#2c333d" opacity={0.5} />
        {/* HVAC unit */}
        <g>
          <rect x={150} y={158} width={40} height={20} rx={2} fill="#10131a" stroke="#05070b" strokeWidth={0.8} />
          {[162, 168, 174, 180].map((lx) => (
            <line key={`hv-${lx}`} x1={lx} y1={160} x2={lx} y2={176} stroke="#2a313b" strokeWidth={1.2} opacity={0.6} />
          ))}
          <rect x={154} y={152} width={6} height={6} fill="#0c0f15" />
        </g>
        {/* vent pipe + chimney + conduit */}
        <rect x={258} y={150} width={9} height={28} rx={2} fill="#0c0f15" />
        <ellipse cx={262.5} cy={150} rx={5} ry={2.4} fill="#1a1f27" />
        <rect x={222} y={162} width={4} height={16} fill="#0e1117" />
        <path d="M118 178 q14 -10 34 -4" stroke="#0a0c11" strokeWidth={1.6} fill="none" opacity={0.7} />
        <path d="M190 176 q20 -6 60 -2" stroke="#0a0c11" strokeWidth={1.3} fill="none" opacity={0.6} />
      </g>

      {/* ============ FRONT FACE (the glowing front wall) ============ */}
      <g>
        <rect x={92} y={184} width={208} height={268} rx={1.5} fill="#15110c" />
        <rect x={92} y={184} width={208} height={268} fill={`url(#${winGlowSoft})`} opacity={0.45} />

        {/* ----- TOP BANNER (focal sign, yellow→blue, red DANANI) ----- */}
        <g>
          {/* banner body: split yellow (left) → blue (right) */}
          <rect x={90} y={188} width={212} height={42} rx={2.5} fill="#cf9a1a" />
          <rect x={90} y={188} width={106} height={42} fill={`url(#${bannerL})`} />
          <rect x={196} y={188} width={106} height={42} fill={`url(#${bannerR})`} />
          {/* thin red top stripe + dark bottom lip */}
          <rect x={90} y={188} width={212} height={4} fill="#e0282e" />
          <rect x={90} y={191} width={212} height={1.4} fill="#ff7a72" opacity={0.7} />
          <rect x={90} y={226} width={212} height={4} fill="#1a1206" opacity={0.7} />
          <rect x={90} y={188} width={212} height={42} rx={2.5} fill={`url(#${bannerSheen})`} opacity={0.32} />
          <rect x={90} y={188} width={212} height={42} rx={2.5} fill="none" stroke="#0c0804" strokeWidth={1.2} />

          {/* left badge — GLOBAL globe */}
          <g>
            <circle cx={108} cy={210} r={12.5} fill="#fff4e6" />
            <circle cx={108} cy={210} r={12.5} fill="none" stroke="#b3141a" strokeWidth={1.6} />
            <circle cx={108} cy={210} r={9} fill="#2b73c9" />
            <path d="M100 206 q8 -3.5 16 0" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.8} />
            <path d="M100 210 q8 0 16 0" stroke="#bfe3ff" strokeWidth={0.7} fill="none" opacity={0.7} />
            <path d="M100 214 q8 3.5 16 0" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.8} />
            <path d="M108 201 q-4.5 9 0 18" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.7} />
            <path d="M103 202 c2.4 4.5 2.4 11 -1 16" stroke="#1d4f8f" strokeWidth={2.6} fill="none" opacity={0.7} />
            <text x={108} y={226} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={4.6} fontWeight={700} fill="#fff4e6" letterSpacing={0.3}>GLOBAL</text>
          </g>

          {/* centre name — DANANI in Bungee, red block, outlined */}
          <text
            x={206}
            y={219}
            textAnchor="middle"
            fontFamily="'Bungee', system-ui, sans-serif"
            fontSize={25}
            fill="#e8242b"
            letterSpacing={1.4}
            stroke="#4a0608"
            strokeWidth={1.1}
            style={{ paintOrder: 'stroke' }}
          >
            DANANI
          </text>
          {/* flanking red 3-point stars */}
          {[126, 286].map((sx) => (
            <path
              key={`star-${sx}`}
              d="M0 -6 L1.6 -1.8 L6 -1.6 L2.4 1.1 L3.6 6 L0 3 L-3.6 6 L-2.4 1.1 L-6 -1.6 L-1.6 -1.8 Z"
              transform={`translate(${sx} 210)`}
              fill="#e0282e"
              stroke="#7a0c10"
              strokeWidth={0.5}
            />
          ))}

          {/* right badge — OPEN 7 DAYS A WEEK (red on white) */}
          <g>
            <rect x={276} y={195} width={24} height={28} rx={2.5} fill="#fff4e6" />
            <rect x={276} y={195} width={24} height={28} rx={2.5} fill="none" stroke="#b3141a" strokeWidth={1.2} />
            <text x={288} y={203} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3} fontWeight={700} fill="#b3141a">OPEN</text>
            <text x={288} y={210} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={7} fill="#b3141a">7</text>
            <text x={288} y={216} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={2.6} fontWeight={700} fill="#1d4f8f">DAYS A</text>
            <text x={288} y={220} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={2.6} fontWeight={700} fill="#1d4f8f">WEEK</text>
            {[280, 296].map((stx) => (
              <path key={`star2-${stx}`} d="M0 -2 L0.6 -0.6 L2 -0.6 L0.9 0.4 L1.3 2 L0 1 L-1.3 2 L-0.9 0.4 L-2 -0.6 L-0.6 -0.6 Z" transform={`translate(${stx} 219)`} fill="#e0282e" />
            ))}
          </g>
        </g>

        {/* awning lip below the banner */}
        <rect x={92} y={230} width={208} height={6} fill="#090b0e" />
        <rect x={92} y={230} width={208} height={2} fill="#ff6a60" opacity={0.28} />
        <rect x={92} y={236} width={208} height={2} fill="#1a1206" opacity={0.6} />

        {/* ----- WINDOWS + DOORS ----- */}
        {/* big left storefront windows (two panes) */}
        {windowPane(100, 252, 66, 192, 'win-l1')}
        {windowPane(168, 252, 26, 192, 'win-l2')}

        {/* OPEN neon (pink) hung in the left glass */}
        <g>
          <rect x={110} y={266} width={46} height={20} rx={3} fill="#1a0a12" opacity={0.55} />
          <ellipse cx={133} cy={276} rx={30} ry={14} fill={`url(#${neonPink})`} opacity={0.55} />
          <g filter={`url(#${neonBlur})`} opacity={0.85}>
            <text x={133} y={282} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={13} fill="#ff4fa8">OPEN</text>
          </g>
          <text x={133} y={282} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={13} fill="#ffd6ec" stroke="#ff5db0" strokeWidth={0.4}>OPEN</text>
        </g>
        {/* ATM neon (blue) in the left-lower glass */}
        <g>
          <rect x={108} y={400} width={34} height={17} rx={2.5} fill="#06121f" />
          <ellipse cx={125} cy={408} rx={22} ry={11} fill={`url(#${neonBlue})`} opacity={0.5} />
          <rect x={108} y={400} width={34} height={17} rx={2.5} fill="none" stroke="#39b7ff" strokeWidth={1} />
          <g filter={`url(#${neonBlur})`} opacity={0.8}>
            <text x={125} y={413} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={10} fill="#3bb6ff">ATM</text>
          </g>
          <text x={125} y={413} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={10} fill="#bfe8ff">ATM</text>
        </g>
        {/* small posters taped in left window */}
        <g opacity={0.92}>
          <rect x={150} y={350} width={14} height={20} rx={1} fill="#3a1414" transform="rotate(-4 157 360)" />
          <text x={157} y={362} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={2.6} fontWeight={700} fill="#ffd0a0" transform="rotate(-4 157 360)">SALE</text>
        </g>

        {/* ----- recessed double glass doors (center-right) ----- */}
        <g>
          {/* recess / threshold */}
          <rect x={198} y={244} width={72} height={208} fill="#0a0805" />
          <rect x={200} y={246} width={68} height={204} rx={1.5} fill="#0c0a07" />
          {/* warm light spilling out through the doors */}
          <rect x={204} y={250} width={60} height={196} rx={1.5} fill={`url(#${interior})`} />
          <rect x={204} y={250} width={60} height={196} rx={1.5} fill={`url(#${winGlow})`} opacity={0.45} />
          {/* interior shelf hints visible through doors */}
          {products(207, 360, 54, 5, 'door-s1')}
          {products(207, 392, 54, 11, 'door-s2')}
          <rect x={206} y={360} width={56} height={1.2} fill="#2a1c10" opacity={0.5} />
          <rect x={206} y={392} width={56} height={1.2} fill="#2a1c10" opacity={0.5} />
          {/* the two door leaves + center stile */}
          <rect x={234} y={250} width={2.6} height={196} fill="#0a0805" />
          <rect x={204} y={250} width={60} height={196} rx={1.5} fill="none" stroke="#080605" strokeWidth={2.6} />
          {/* push bars / handles */}
          <rect x={226} y={350} width={2.6} height={34} rx={1.2} fill="#d9c9a6" />
          <rect x={242} y={350} width={2.6} height={34} rx={1.2} fill="#d9c9a6" />
          {/* glass cross-rail */}
          <rect x={204} y={330} width={60} height={2} fill="#1c130c" opacity={0.6} />
          {/* door stickers */}
          <rect x={210} y={300} width={11} height={9} rx={1} fill="#1c6b34" opacity={0.9} />
          <rect x={247} y={304} width={10} height={7} rx={1} fill="#b3245a" opacity={0.85} />
          <circle cx={216} cy={336} r={3.2} fill="#ffd34d" opacity={0.85} />
          {/* threshold step + warm spill onto deck */}
          <rect x={198} y={448} width={72} height={5} fill="#1a1410" />
          <rect x={204} y={446} width={60} height={5} fill="#ffcf86" opacity={0.42} />
          <rect x={198} y={244} width={72} height={208} fill={`url(#${glassSheen})`} opacity={0.1} />
        </g>
      </g>

      {/* ============ DOCK / PONTOON (aluminium modular float) ============ */}
      <g>
        {/* top deck */}
        <polygon points="44,452 436,452 416,484 64,484" fill={`url(#${dockTop})`} />
        {/* modular panel seams (perspective) */}
        {Array.from({ length: 9 }).map((_, i) => {
          const f = i / 9
          return (
            <line
              key={`seam-${i}`}
              x1={44 + (436 - 44) * f}
              y1={452}
              x2={64 + (416 - 64) * f}
              y2={484}
              stroke="#0b1118"
              strokeWidth={0.7}
              opacity={0.42}
            />
          )
        })}
        <line x1={54} y1={468} x2={426} y2={468} stroke="#0b1118" strokeWidth={0.6} opacity={0.3} />
        {/* faint deck highlight + scuffs */}
        <polygon points="44,452 436,452 433,457 47,457" fill="#c2cbd5" opacity={0.32} />
        {[120, 210, 300, 370].map((sx, i) => (
          <ellipse key={`scuff-${sx}`} cx={sx} cy={468 + i} rx={10} ry={2} fill="#0a0f16" opacity={0.18} />
        ))}

        {/* black rubber bumper / trim around the top edge */}
        <polygon points="44,452 436,452 436,458 44,458" fill={`url(#${bumper})`} />
        <polygon points="44,452 64,484 64,490 44,458" fill="#0a0c0f" />
        <polygon points="436,452 416,484 416,490 436,458" fill="#0a0c0f" />

        {/* dock front face (the side that meets the water) */}
        <polygon points="64,484 416,484 408,500 72,500" fill={`url(#${dockFace})`} />
        <rect x={72} y={483} width={344} height={2} fill="#aeb8c4" opacity={0.42} />
        {/* panel division shading on the face */}
        {[150, 240, 330].map((fx) => (
          <line key={`face-${fx}`} x1={fx} y1={484} x2={fx - 2} y2={500} stroke="#070a0e" strokeWidth={0.8} opacity={0.4} />
        ))}
        {/* right side of pontoon visible (3/4) */}
        <polygon points="416,484 436,458 436,470 408,500" fill={`url(#${dockSide})`} />

        {/* cleats + chains at front corners */}
        {[80, 400].map((cx) => (
          <g key={`cleat-${cx}`}>
            <rect x={cx - 5} y={476} width={10} height={5} rx={2} fill="#cdd6e0" />
            <rect x={cx - 6} y={479} width={12} height={2.4} rx={1} fill="#8a949e" />
            <ellipse cx={cx} cy={482} rx={3} ry={1.4} fill="#5a636c" />
          </g>
        ))}
        {/* metal chains down to the water */}
        <path d="M80 481 q-7 10 -12 17" stroke="#7a838d" strokeWidth={1.8} fill="none" strokeDasharray="1.6 1.6" opacity={0.85} />
        <path d="M400 481 q7 10 12 17" stroke="#7a838d" strokeWidth={1.8} fill="none" strokeDasharray="1.6 1.6" opacity={0.85} />
      </g>

      {/* ============ FRONT-DECK CLUTTER ============ */}
      {/* LEFT: stacked black milk crates w/ flowers + apples on a green stand */}
      <g>
        {/* green stand */}
        <rect x={66} y={436} width={62} height={16} rx={2} fill="#163a20" stroke="#0c2413" strokeWidth={1} />
        <rect x={66} y={436} width={62} height={3} fill="#1f5c30" opacity={0.7} />
        {/* two stacked black milk crates */}
        {[
          { x: 70, y: 412 },
          { x: 96, y: 414 },
          { x: 78, y: 392 },
        ].map((cr) => (
          <g key={`crate-${cr.x}-${cr.y}`}>
            <rect x={cr.x} y={cr.y} width={26} height={24} rx={2} fill="#141414" stroke="#000" strokeWidth={1} />
            {/* crate lattice */}
            {[0, 1, 2].map((g) => (
              <line key={`cl-v-${cr.x}-${g}`} x1={cr.x + 6 + g * 7} y1={cr.y + 2} x2={cr.x + 6 + g * 7} y2={cr.y + 22} stroke="#2c2c2c" strokeWidth={1} opacity={0.8} />
            ))}
            {[0, 1].map((g) => (
              <line key={`cl-h-${cr.x}-${g}`} x1={cr.x + 2} y1={cr.y + 8 + g * 8} x2={cr.x + 24} y2={cr.y + 8 + g * 8} stroke="#2c2c2c" strokeWidth={1} opacity={0.8} />
            ))}
          </g>
        ))}
        {/* red apples in the front crate */}
        {[
          { x: 100, y: 420 }, { x: 108, y: 422 }, { x: 116, y: 419 }, { x: 104, y: 426 }, { x: 113, y: 425 },
        ].map((a) => (
          <g key={`apple-${a.x}-${a.y}`}>
            <circle cx={a.x} cy={a.y} r={3} fill="#c62f28" />
            <circle cx={a.x - 0.9} cy={a.y - 0.9} r={0.9} fill="#ff8a6e" opacity={0.8} />
          </g>
        ))}
        {/* flower bunches — clustered colour blobs in the top crate */}
        <ellipse cx={91} cy={388} rx={28} ry={12} fill="#1d3b22" opacity={0.9} />
        {[
          { x: 70, y: 384, c: '#ff5d8a' }, { x: 78, y: 378, c: '#ffd24d' }, { x: 86, y: 382, c: '#ff7a4d' },
          { x: 94, y: 376, c: '#e0e0e0' }, { x: 102, y: 381, c: '#c77dff' }, { x: 110, y: 385, c: '#ff5d8a' },
          { x: 84, y: 374, c: '#ffe08a' }, { x: 100, y: 373, c: '#ff9ad4' }, { x: 74, y: 380, c: '#7be0a0' },
          { x: 106, y: 378, c: '#ffd24d' },
        ].map((f) => (
          <g key={`bloom-${f.x}-${f.y}`}>
            <line x1={f.x} y1={f.y} x2={f.x + (f.x < 90 ? 2 : -2)} y2={388} stroke="#274a2c" strokeWidth={1.2} />
            {/* clustered petals = several small dots */}
            <circle cx={f.x} cy={f.y} r={3.4} fill={f.c} />
            <circle cx={f.x - 2} cy={f.y - 1} r={1.8} fill={f.c} opacity={0.85} />
            <circle cx={f.x + 2} cy={f.y - 0.5} r={1.8} fill={f.c} opacity={0.85} />
            <circle cx={f.x} cy={f.y - 2} r={1.6} fill={f.c} opacity={0.8} />
            <circle cx={f.x} cy={f.y} r={1.1} fill="#fff6cf" opacity={0.9} />
          </g>
        ))}
      </g>

      {/* RIGHT: yellow fire hydrant + trash can + steel bin */}
      {/* fire hydrant */}
      <g>
        <ellipse cx={336} cy={452} rx={12} ry={3.2} fill="#000" opacity={0.32} />
        <rect x={329} y={418} width={14} height={34} rx={5.5} fill={`url(#${hydrantGrad})`} />
        <path d="M329 423 q7 -11 14 0 Z" fill="#ffd633" />
        <circle cx={336} cy={416} r={2.6} fill="#e0a800" />
        <circle cx={326} cy={432} r={3.6} fill="#ffe25a" stroke="#b58900" strokeWidth={1} />
        <circle cx={346} cy={432} r={3.6} fill="#ffe25a" stroke="#b58900" strokeWidth={1} />
        <circle cx={336} cy={428} r={2.2} fill="#e0a800" />
        <rect x={326} y={446} width={20} height={6} rx={1.5} fill="#d6a400" />
        <rect x={331} y={423} width={2.8} height={24} rx={1.4} fill="#fff3a8" opacity={0.7} />
        {/* weather streaks on hydrant */}
        <rect x={340} y={426} width={1.4} height={20} fill="#9a7400" opacity={0.4} />
      </g>
      {/* trash can with domed lid */}
      <g>
        <ellipse cx={372} cy={452} rx={13} ry={3} fill="#000" opacity={0.3} />
        <rect x={361} y={420} width={22} height={32} rx={2.5} fill={`url(#${canGrad})`} />
        <rect x={361} y={420} width={22} height={32} rx={2.5} fill="none" stroke="#0a0f16" strokeWidth={1} />
        {/* domed lid */}
        <path d="M358 420 q14 -10 28 0 Z" fill="#222e3a" stroke="#0a0f16" strokeWidth={1} />
        <ellipse cx={372} cy={416} rx={5} ry={2.4} fill="#2e3c48" />
        {/* ribs */}
        {[428, 434, 440, 446].map((ry) => (
          <line key={`rib-${ry}`} x1={363} y1={ry} x2={381} y2={ry} stroke="#0a0f16" strokeWidth={1} opacity={0.55} />
        ))}
        <rect x={364} y={422} width={2} height={28} fill="#3a4854" opacity={0.5} />
      </g>
      {/* small steel bin beside it */}
      <g>
        <rect x={386} y={432} width={12} height={20} rx={1.5} fill="#3a4450" stroke="#10161e" strokeWidth={0.8} />
        <rect x={386} y={432} width={12} height={3} fill="#5a6470" opacity={0.6} />
        <rect x={387} y={434} width={1.6} height={16} fill="#6a7480" opacity={0.5} />
      </g>
    </g>
  )

  // Bright emitters only — this group is vertically smeared + screen-blended to
  // make the neon/banner/window streaks waver in the water reflection.
  const Emitters = (
    <g>
      {/* banner: yellow→blue + the red DANANI strip */}
      <rect x={90} y={190} width={106} height={38} rx={2.5} fill="#ffd34d" />
      <rect x={196} y={190} width={106} height={38} rx={2.5} fill="#2f7fd6" />
      <rect x={140} y={196} width={132} height={26} rx={2} fill="#e8242b" />
      {/* OPEN neon (pink) */}
      <rect x={110} y={266} width={46} height={20} rx={3} fill="#ff4fa8" />
      {/* ATM neon (blue) */}
      <rect x={108} y={400} width={34} height={17} rx={2.5} fill="#3bb6ff" />
      {/* warm windows */}
      <rect x={100} y={252} width={66} height={192} rx={2} fill="#ffb557" />
      <rect x={168} y={252} width={26} height={192} rx={2} fill="#ffb557" />
      {/* door warm light */}
      <rect x={204} y={250} width={60} height={196} rx={1.5} fill="#ffcf86" />
      {/* hydrant + lamp */}
      <rect x={329} y={418} width={14} height={34} rx={5.5} fill="#ffd633" />
      <circle cx={372} cy={258} r={9} fill="#ffd9a0" />
      {/* flowers warm-pink cluster */}
      <ellipse cx={90} cy={380} rx={24} ry={10} fill="#ff7aa8" />
    </g>
  )

  return (
    <main className="convenience2-root relative isolate min-h-screen overflow-hidden bg-background">
      {/* Ocean Waves twilight shader background */}
      <OceanShader />

      {/* small floating store + reflection, sitting on the shader's water */}
      <svg
        aria-hidden
        className="convenience2-store"
        viewBox="0 0 480 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* ---- brick ---- */}
          <linearGradient id={brickFill} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6e2f24" />
            <stop offset="100%" stopColor="#491c15" />
          </linearGradient>
          <linearGradient id={brickShade} x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id={brickStreak} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.4} />
          </linearGradient>

          {/* ---- roof ---- */}
          <linearGradient id={roofGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#181c25" />
            <stop offset="100%" stopColor="#0b0e14" />
          </linearGradient>
          <linearGradient id={sideRoof} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#12151c" />
            <stop offset="100%" stopColor="#080a0f" />
          </linearGradient>

          {/* ---- interior / glass ---- */}
          <radialGradient id={interior} cx="50%" cy="42%" r="78%">
            <stop offset="0%" stopColor="#fff0d2" />
            <stop offset="50%" stopColor="#ffcf86" />
            <stop offset="100%" stopColor="#bd7634" />
          </radialGradient>
          <linearGradient id={interiorDeep} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a5326" />
            <stop offset="100%" stopColor="#bd7634" stopOpacity={0} />
          </linearGradient>
          <radialGradient id={winGlow} cx="50%" cy="35%" r="82%">
            <stop offset="0%" stopColor="#fff6e6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ffcf86" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={winGlowSoft} cx="50%" cy="62%" r="72%">
            <stop offset="0%" stopColor="#ffb86b" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#ffb86b" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={glassSheen} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#cfe2ff" stopOpacity={0.6} />
            <stop offset="35%" stopColor="#cfe2ff" stopOpacity={0} />
          </linearGradient>

          {/* ---- banner ---- */}
          <linearGradient id={bannerL} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2c33a" />
            <stop offset="100%" stopColor="#cf9a1a" />
          </linearGradient>
          <linearGradient id={bannerR} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f7fd6" />
            <stop offset="100%" stopColor="#1a4f96" />
          </linearGradient>
          <linearGradient id={bannerSheen} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
            <stop offset="40%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>

          {/* ---- dock / metal ---- */}
          <linearGradient id={dockTop} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9aa6b2" />
            <stop offset="100%" stopColor="#6b7682" />
          </linearGradient>
          <linearGradient id={dockFace} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a6470" />
            <stop offset="100%" stopColor="#2c343d" />
          </linearGradient>
          <linearGradient id={dockSide} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3c4654" />
            <stop offset="100%" stopColor="#1c242d" />
          </linearGradient>
          <linearGradient id={bumper} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2e33" />
            <stop offset="100%" stopColor="#0a0c0f" />
          </linearGradient>
          <linearGradient id={hydrantGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe25a" />
            <stop offset="55%" stopColor="#f5c211" />
            <stop offset="100%" stopColor="#bd8c00" />
          </linearGradient>
          <linearGradient id={canGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c3845" />
            <stop offset="100%" stopColor="#161e26" />
          </linearGradient>
          <radialGradient id={buoyGrad} cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#fff0a0" />
            <stop offset="60%" stopColor="#f5c211" />
            <stop offset="100%" stopColor="#b58900" />
          </radialGradient>

          {/* ---- glows / spill ---- */}
          <radialGradient id={spill} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffca73" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ffca73" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={doorSpill} cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#ffdca0" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ffdca0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={softGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={neonPink} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4fa8" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ff4fa8" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={neonBlue} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3bb6ff" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#3bb6ff" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={lampGlow} cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#ffdfa0" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#ffdfa0" stopOpacity={0} />
          </radialGradient>

          {/* ---- neon tube bloom ---- */}
          <filter id={neonBlur} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>

          {/* ---- water distortion (static noise; sway comes from CSS) ---- */}
          <filter id={ripple} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.045" numOctaves={3} seed={17} stitchTiles="stitch" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={11} xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* ---- vertical smear for neon streaks ---- */}
          <filter id={streakBlur} x="-30%" y="-10%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.6 16" />
          </filter>

          {/* ---- subtle film grain over the upright store ---- */}
          <filter id={grain} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} stitchTiles="stitch" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
          </filter>

          {/* ---- reflection fade mask ---- */}
          <linearGradient id={reflMask} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.56} />
            <stop offset="22%" stopColor="#fff" stopOpacity={0.36} />
            <stop offset="58%" stopColor="#fff" stopOpacity={0.14} />
            <stop offset="90%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={streakMask} maskUnits="userSpaceOnUse" x="0" y={WATER_Y} width="480" height={REFL_H}>
            <rect x="0" y={WATER_Y} width="480" height={REFL_H} fill={`url(#${reflMask})`} />
          </mask>
        </defs>

        {/* sky + sea come from the Ocean Waves shader behind this SVG */}

        {/* ===== REFLECTION (mirrored, displaced, faded) — over shader water ===== */}
        <g className="convenience2-refl">
          <g mask={`url(#${streakMask})`}>
            <g transform={`translate(0 ${WATER_Y * 2}) scale(1 -1)`}>
              {/* reflected buoys: pre-flip y so display-y lands just below the
                  waterline (display_y = 2*WATER_Y - y → y≈484 ⇒ display≈516) */}
              {[
                { x: 40, y: 484, c: '#f5c211' },
                { x: 446, y: 478, c: '#f5c211' },
                { x: 96, y: 460, c: '#f5c211' },
                { x: 408, y: 452, c: '#f5c211' },
              ].map((b) => (
                <ellipse key={`rbuoy-${b.x}`} cx={b.x} cy={b.y} rx={6} ry={3.5} fill={b.c} opacity={0.45} />
              ))}
              {/* smeared neon streaks under the structural reflection (screen) */}
              <g filter={`url(#${streakBlur})`} opacity={0.4} transform="scale(1 1.5)" style={{ mixBlendMode: 'screen' }}>
                {Emitters}
              </g>
              {/* the structural reflection, watery + dim */}
              <g filter={`url(#${ripple})`} opacity={0.46}>
                {StoreScene}
              </g>
              {/* blue + dark wash to push it underwater */}
              <rect x="0" y={WATER_Y - REFL_H} width="480" height={REFL_H} fill="#0e1c30" opacity={0.55} style={{ mixBlendMode: 'multiply' }} />
            </g>
          </g>
        </g>

        {/* waterline contact — seats the dock on the water */}
        <ellipse cx={236} cy={WATER_Y - 4} rx={196} ry={8} fill="#06121f" opacity={0.5} />
        <ellipse cx={236} cy={WATER_Y - 6} rx={150} ry={2.6} fill="#ffdcab" opacity={0.2} />

        {/* ===== UPRIGHT STORE (drawn last, on top) ===== */}
        {StoreScene}

        {/* faint film grain over the whole store to break vector smoothness */}
        <rect x="0" y="120" width="480" height="380" filter={`url(#${grain})`} opacity={0.05} style={{ mixBlendMode: 'overlay' }} />

        {/* warm bloom over the storefront */}
        <ellipse cx={210} cy={340} rx={200} ry={150} fill={`url(#${softGlow})`} opacity={0.16} />

        {/* yellow foam buoys floating around the dock */}
        {[
          { x: 40, y: 512, r: 7 },
          { x: 446, y: 522, r: 6.5 },
          { x: 96, y: 540, r: 6 },
          { x: 408, y: 548, r: 7 },
          { x: 24, y: 548, r: 5.5 },
        ].map((b) => (
          <g key={`buoy-${b.x}-${b.y}`}>
            <ellipse cx={b.x} cy={b.y + b.r + 1} rx={b.r + 2} ry={2.4} fill="#000" opacity={0.3} />
            <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#${buoyGrad})`} />
            <rect x={b.x - b.r} y={b.y - 1.6} width={b.r * 2} height={3.2} fill="#1c242d" opacity={0.7} />
            <circle cx={b.x} cy={b.y} r={b.r} fill="none" stroke="#00000050" strokeWidth={1} />
            <circle cx={b.x - b.r * 0.35} cy={b.y - b.r * 0.35} r={b.r * 0.3} fill="#fff6cf" opacity={0.55} />
          </g>
        ))}
      </svg>

      {/* vignette + atmosphere on top of the canvas */}
      <div aria-hidden className="convenience2-vignette" />

      {/* ===== OVERLAY CONTENT (kept off the store, top-left) ===== */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:py-16">
        <div className="convenience2-overlay max-w-md">
          <m.p
            {...rise(0.05)}
            className="convenience2-eyebrow font-mono text-[0.7rem] uppercase tracking-[0.34em]"
          >
            <span className="convenience2-eyebrow-dot" />
            Open for work · Software Engineer
          </m.p>

          <m.p
            {...rise(0.16)}
            className="convenience2-tagline mt-5 font-sans text-base leading-relaxed sm:text-lg"
          >
            Building resilient distributed systems — Spring Boot, Postgres, Redis
            &amp; Kafka. Open late, always stocked, always shipping.
          </m.p>

          <m.div {...rise(0.28)} className="mt-7 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="convenience2-cta convenience2-cta--primary font-mono text-xs font-semibold uppercase tracking-[0.16em]"
            >
              View projects
            </a>
            <a
              href="#about"
              className="convenience2-cta convenience2-cta--ghost font-mono text-xs font-semibold uppercase tracking-[0.16em]"
            >
              About
            </a>
          </m.div>
        </div>
      </div>
    </main>
  )
}
