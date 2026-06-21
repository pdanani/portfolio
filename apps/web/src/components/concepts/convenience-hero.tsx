import { useId } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Floating Mart — a tiny lit convenience store on an aluminium pontoon, moored on
 * a glass-still lake at blue hour. The store + dock is drawn once as an inline-SVG
 * group (`StoreScene`) so the water reflection can re-use it: the reflected copy is
 * flipped vertically, pushed through a STATIC feTurbulence/feDisplacementMap (the
 * water is calm — no looping animation), and doubled by a vertically-smeared,
 * screen-blended "light streak" layer so the red banner, neon and warm windows
 * bleed downward into the lake. Only the overlay text fades in on mount.
 */
export function ConvenienceHero() {
  const reduce = useReducedMotion()

  // Unique ids so multiple instances never collide on filter/gradient defs.
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `cv-${name}-${uid}`

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  // ---- ids (declared once, threaded into the SVG defs + url() refs) ----
  const skyGrad = id('sky')
  const waterGrad = id('water')
  const brickFill = id('brick')
  const brickShade = id('brickShade')
  const roofGrad = id('roof')
  const winGlow = id('winGlow')
  const winGlowSoft = id('winGlowSoft')
  const interior = id('interior')
  const bannerGrad = id('banner')
  const bannerSheen = id('bannerSheen')
  const dockGrad = id('dock')
  const dockEdge = id('dockEdge')
  const hydrantGrad = id('hydrant')
  const spill = id('spill')
  const haze = id('haze')
  const softGlow = id('softGlow')
  const ripple = id('ripple')
  const streakBlur = id('streakBlur')
  const reflMask = id('reflMask')
  const streakMask = id('streakMask')
  const waterSheen = id('waterSheen')

  // Waterline (in viewBox units). The reflection mirrors about this line.
  const WATER_Y = 372
  const REFL_H = 760 - WATER_Y

  // Shelf product silhouettes — rows of little colour boxes glowing in a window.
  const tints = ['#ff6b5e', '#ffd166', '#6fd0ff', '#b6f36b', '#ff9ad4', '#ffb066']
  const products = (x: number, y: number, w: number, key: string) => {
    const cols = Math.max(3, Math.round(w / 11))
    const cw = w / cols
    return (
      <g key={key}>
        {Array.from({ length: cols }).map((_, i) => {
          const h = 7 + ((i * 5 + key.length) % 4) * 2
          return (
            <rect
              key={`${key}-${i}`}
              x={x + i * cw + 0.8}
              y={y - h}
              width={cw - 1.6}
              height={h}
              rx={1}
              fill={tints[(i + key.length) % tints.length]}
              opacity={0.92}
            />
          )
        })}
      </g>
    )
  }

  // One lit plate-glass window: glowing interior, three product shelves, a frame.
  const windowPane = (x: number, y: number, w: number, h: number, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={`url(#${interior})`} />
      <rect x={x} y={y} width={w} height={h} rx={3} fill={`url(#${winGlow})`} opacity={0.55} />
      {products(x + 4, y + h * 0.42, w - 8, `${key}-s1`)}
      {products(x + 4, y + h * 0.66, w - 8, `${key}-s2`)}
      {products(x + 4, y + h * 0.9, w - 8, `${key}-s3`)}
      <rect x={x + 3} y={y + h * 0.42} width={w - 6} height={1.5} fill="#3a2a1c" opacity={0.5} />
      <rect x={x + 3} y={y + h * 0.66} width={w - 6} height={1.5} fill="#3a2a1c" opacity={0.5} />
      <rect x={x + w / 2 - 1} y={y} width={2} height={h} fill="#1c130c" opacity={0.45} />
      <rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke="#0d0a07" strokeWidth={2.5} />
      <path
        d={`M${x + 2} ${y + 2} L${x + w * 0.4} ${y + 2} L${x + 2} ${y + h * 0.5} Z`}
        fill="#ffffff"
        opacity={0.06}
      />
    </g>
  )

  /**
   * The complete store + dock as a self-contained group, drawn in scene-space.
   * Rendered upright once and a second time (flipped) for the reflection.
   */
  const StoreScene = (
    <g>
      {/* warm light spilled onto the dock in front of the store */}
      <ellipse cx={210} cy={362} rx={150} ry={20} fill={`url(#${spill})`} />

      {/* ---------- BUILDING ---------- */}
      {/* right brick side wall (3/4 view) */}
      <g>
        <polygon points="300,150 360,176 360,352 300,344" fill={`url(#${brickFill})`} />
        <polygon points="300,150 360,176 360,352 300,344" fill={`url(#${brickShade})`} opacity={0.9} />
        {Array.from({ length: 14 }).map((_, r) => {
          const t = r / 14
          return (
            <line
              key={`bc-${r}`}
              x1={300}
              y1={150 + (344 - 150) * t}
              x2={360}
              y2={176 + (352 - 176) * t}
              stroke="#1c0f0a"
              strokeWidth={0.8}
              opacity={0.4}
            />
          )
        })}
        <line x1={320} y1={158} x2={320} y2={346} stroke="#1c0f0a" strokeWidth={0.6} opacity={0.25} />
        <line x1={340} y1={166} x2={340} y2={349} stroke="#1c0f0a" strokeWidth={0.6} opacity={0.25} />
        {/* wall lamp */}
        <g>
          <rect x={349} y={210} width={4} height={6} fill="#15100b" />
          <path d="M345 216 L357 216 L353 226 L349 226 Z" fill="#241812" />
          <ellipse cx={351} cy={226} rx={9} ry={5} fill="#ffd9a0" opacity={0.5} />
          <circle cx={351} cy={224} r={2} fill="#fff1d6" />
        </g>
        {/* security camera */}
        <g>
          <rect x={343} y={188} width={4} height={4} fill="#0d0a07" />
          <rect x={336} y={186} width={9} height={6} rx={2} fill="#14100c" />
          <circle cx={337} cy={189} r={1.6} fill="#0a0a0a" />
          <circle cx={336.6} cy={188.6} r={0.5} fill="#7fff9a" />
        </g>
      </g>

      {/* roof slab + parapet + rooftop units */}
      <g>
        <polygon points="60,150 300,150 360,176 120,176" fill={`url(#${roofGrad})`} />
        <rect x={60} y={146} width={240} height={8} rx={2} fill="#0b0d12" />
        <rect x={120} y={132} width={34} height={18} rx={2} fill="#0f1218" />
        <rect x={124} y={136} width={26} height={2} fill="#2a2f38" opacity={0.6} />
        <rect x={124} y={140} width={26} height={2} fill="#2a2f38" opacity={0.6} />
        <rect x={210} y={128} width={10} height={22} rx={2} fill="#0c0f15" />
        <ellipse cx={215} cy={128} rx={6} ry={3} fill="#171b22" />
      </g>

      {/* storefront face (the glowing front wall) */}
      <g>
        <rect x={60} y={172} width={240} height={172} rx={2} fill="#14100b" />
        <rect x={60} y={172} width={240} height={172} rx={2} fill={`url(#${winGlowSoft})`} opacity={0.5} />

        {/* ----- BANNER (focal red sign) ----- */}
        <g>
          <rect x={58} y={176} width={244} height={40} rx={3} fill="#5a0d10" />
          <rect x={58} y={176} width={244} height={40} rx={3} fill={`url(#${bannerGrad})`} />
          <rect x={58} y={176} width={244} height={4} fill="#ff5a52" opacity={0.55} />
          <rect x={58} y={212} width={244} height={4} fill="#3a0608" opacity={0.7} />
          <rect x={58} y={176} width={244} height={40} rx={3} fill={`url(#${bannerSheen})`} opacity={0.35} />

          {/* left badge — globe + GLOBAL */}
          <g>
            <circle cx={74} cy={196} r={11} fill="#fff4e6" />
            <circle cx={74} cy={196} r={11} fill="none" stroke="#b3141a" strokeWidth={1.5} />
            <circle cx={74} cy={196} r={8} fill="#2b73c9" />
            <path d="M67 193 q7 -3 14 0" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.8} />
            <path d="M67 199 q7 3 14 0" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.8} />
            <path d="M74 188 q-4 8 0 16" stroke="#bfe3ff" strokeWidth={0.8} fill="none" opacity={0.7} />
            <path d="M70 189 c2 4 2 10 -1 14" stroke="#1d4f8f" strokeWidth={2.4} fill="none" opacity={0.7} />
            <text
              x={74}
              y={210.5}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize={4.4}
              fontWeight={700}
              fill="#fff4e6"
              letterSpacing={0.3}
            >
              GLOBAL
            </text>
          </g>

          {/* centre name in Bungee */}
          <text
            x={181}
            y={203}
            textAnchor="middle"
            fontFamily="'Bungee', system-ui, sans-serif"
            fontSize={23}
            fill="#fff6ee"
            letterSpacing={1.2}
            stroke="#5c0a0d"
            strokeWidth={0.6}
            style={{ paintOrder: 'stroke' }}
          >
            DANANI
          </text>
          {[100, 262].map((sx) => (
            <path
              key={`star-${sx}`}
              d="M0 -5 L1.5 -1.5 L5 -1.5 L2.2 1 L3.3 5 L0 2.6 L-3.3 5 L-2.2 1 L-5 -1.5 L-1.5 -1.5 Z"
              transform={`translate(${sx} 196)`}
              fill="#ffd34d"
              stroke="#a8141a"
              strokeWidth={0.4}
            />
          ))}

          {/* right badge — OPEN 7 DAYS A WEEK */}
          <g>
            <rect x={276} y={184} width={22} height={24} rx={3} fill="#fff4e6" />
            <rect x={276} y={184} width={22} height={24} rx={3} fill="none" stroke="#b3141a" strokeWidth={1.2} />
            <text x={287} y={193} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={6.4} fill="#b3141a">7</text>
            <text x={287} y={199} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3.3} fontWeight={700} fill="#1d4f8f">DAYS</text>
            <text x={287} y={203} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3} fontWeight={700} fill="#1d4f8f">A</text>
            <text x={287} y={206.6} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3} fontWeight={700} fill="#1d4f8f">WEEK</text>
          </g>
        </g>

        {/* awning lip below the banner */}
        <rect x={60} y={216} width={240} height={6} fill="#0a0c10" />
        <rect x={60} y={216} width={240} height={2} fill="#ff6a60" opacity={0.3} />

        {/* ----- WINDOWS + DOOR ----- */}
        {windowPane(70, 232, 78, 104, 'win-l')}

        {/* middle: glass door */}
        <g>
          <rect x={158} y={228} width={64} height={114} rx={2} fill="#0c0a07" />
          <rect x={162} y={232} width={56} height={106} rx={2} fill={`url(#${interior})`} />
          <rect x={162} y={232} width={56} height={106} rx={2} fill={`url(#${winGlow})`} opacity={0.5} />
          <line x1={190} y1={232} x2={190} y2={338} stroke="#0c0a07" strokeWidth={2.5} />
          <rect x={184} y={282} width={2.4} height={26} rx={1} fill="#d9c9a6" />
          <rect x={193.5} y={282} width={2.4} height={26} rx={1} fill="#d9c9a6" />
          {/* OPEN neon hung in the door glass */}
          <g>
            <rect x={170} y={244} width={40} height={15} rx={3} fill="#1a0a12" opacity={0.7} />
            <text x={190} y={255} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={9.5} fill="#ff5db0" stroke="#ff8fce" strokeWidth={0.3}>OPEN</text>
          </g>
          <rect x={158} y={338} width={64} height={6} fill="#ffcf86" opacity={0.5} />
          <rect x={158} y={228} width={64} height={114} rx={2} fill="none" stroke="#080605" strokeWidth={2.5} />
        </g>

        {windowPane(232, 232, 60, 104, 'win-r')}

        {/* ATM blue sign in right window */}
        <g>
          <rect x={240} y={244} width={30} height={15} rx={2.5} fill="#06121f" />
          <rect x={240} y={244} width={30} height={15} rx={2.5} fill="none" stroke="#39b7ff" strokeWidth={1} />
          <text x={255} y={255} textAnchor="middle" fontFamily="'Bungee', system-ui, sans-serif" fontSize={8} fill="#5cc6ff">ATM</text>
        </g>
        {/* small posters in left window */}
        <g opacity={0.92}>
          <rect x={78} y={300} width={26} height={16} rx={1.5} fill="#0d2a44" />
          <text x={91} y={307} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3.4} fontWeight={700} fill="#7fd4ff">ICE</text>
          <text x={91} y={312} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={2.9} fontWeight={700} fill="#cfeaff">SOLD HERE</text>
          <rect x={112} y={304} width={28} height={12} rx={1.5} fill="#3a1414" />
          <text x={126} y={312} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={3} fontWeight={700} fill="#ffd0a0">FOOD CENTRE</text>
        </g>
      </g>

      {/* ---------- DOCK / PONTOON ---------- */}
      <g>
        <polygon points="36,344 384,344 372,366 48,366" fill={`url(#${dockGrad})`} />
        {Array.from({ length: 7 }).map((_, i) => {
          const fx = i / 7
          return (
            <line
              key={`plank-${i}`}
              x1={36 + (384 - 36) * fx}
              y1={344}
              x2={48 + (372 - 48) * fx}
              y2={366}
              stroke="#0a0f16"
              strokeWidth={0.7}
              opacity={0.4}
            />
          )
        })}
        <polygon points="48,366 372,366 366,376 54,376" fill={`url(#${dockEdge})`} />
        <rect x={48} y={365} width={324} height={2} fill="#aeb8c4" opacity={0.4} />
        {[52, 366].map((cx) => (
          <g key={`cleat-${cx}`}>
            <rect x={cx - 4} y={358} width={8} height={4} rx={1.5} fill="#cdd6e0" />
            <rect x={cx - 5} y={360} width={10} height={2} rx={1} fill="#8a949e" />
          </g>
        ))}
      </g>

      {/* ---------- FOREGROUND PROPS ---------- */}
      {/* flowers in a crate (left) */}
      <g>
        <rect x={44} y={326} width={40} height={20} rx={2} fill="#3c2a18" />
        <rect x={44} y={326} width={40} height={20} rx={2} fill="none" stroke="#241608" strokeWidth={1.5} />
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`crate-slat-${i}`} x1={44 + i * 13} y1={326} x2={44 + i * 13} y2={346} stroke="#241608" strokeWidth={1} opacity={0.6} />
        ))}
        <ellipse cx={64} cy={324} rx={22} ry={9} fill="#1d3b22" />
        {[
          { x: 50, y: 320, c: '#ff5d8a' },
          { x: 58, y: 316, c: '#ffd24d' },
          { x: 66, y: 319, c: '#ff7a4d' },
          { x: 74, y: 315, c: '#c77dff' },
          { x: 80, y: 321, c: '#ff5d8a' },
          { x: 70, y: 313, c: '#ffe08a' },
          { x: 54, y: 314, c: '#7be0a0' },
        ].map((f) => (
          <g key={`bloom-${f.x}-${f.y}`}>
            <line x1={f.x} y1={f.y} x2={f.x} y2={326} stroke="#274a2c" strokeWidth={1.2} />
            <circle cx={f.x} cy={f.y} r={3.2} fill={f.c} />
            <circle cx={f.x} cy={f.y} r={1.1} fill="#fff6cf" opacity={0.85} />
          </g>
        ))}
      </g>

      {/* trash can */}
      <g>
        <rect x={300} y={322} width={18} height={24} rx={2} fill="#1a2430" />
        <rect x={300} y={322} width={18} height={24} rx={2} fill="none" stroke="#0c1219" strokeWidth={1} />
        <rect x={298} y={319} width={22} height={4} rx={2} fill="#2a3742" />
        <rect x={303} y={328} width={12} height={2} fill="#0c1219" opacity={0.7} />
        <rect x={303} y={333} width={12} height={2} fill="#0c1219" opacity={0.7} />
      </g>

      {/* yellow fire hydrant (right) */}
      <g>
        <ellipse cx={342} cy={345} rx={11} ry={3} fill="#000" opacity={0.35} />
        <rect x={336} y={314} width={12} height={30} rx={5} fill={`url(#${hydrantGrad})`} />
        <path d="M336 318 q6 -10 12 0 Z" fill="#ffd633" />
        <circle cx={342} cy={312} r={2.2} fill="#e0a800" />
        <circle cx={334} cy={326} r={3.2} fill="#ffe25a" stroke="#b58900" strokeWidth={1} />
        <circle cx={350} cy={326} r={3.2} fill="#ffe25a" stroke="#b58900" strokeWidth={1} />
        <circle cx={342} cy={322} r={2} fill="#e0a800" />
        <rect x={333} y={340} width={18} height={5} rx={1.5} fill="#d6a400" />
        <rect x={338} y={318} width={2.5} height={22} rx={1.2} fill="#fff3a8" opacity={0.7} />
      </g>

      {/* mooring chains from cleats down to water */}
      <path d="M52 360 q-6 8 -10 12" stroke="#7a838d" strokeWidth={1.6} fill="none" strokeDasharray="1.5 1.5" opacity={0.8} />
      <path d="M366 360 q6 8 10 12" stroke="#7a838d" strokeWidth={1.6} fill="none" strokeDasharray="1.5 1.5" opacity={0.8} />
    </g>
  )

  // Just the bright emitters — this group is what gets vertically smeared +
  // screen-blended to make the neon streaks wavering in the water.
  const Emitters = (
    <g>
      <rect x={58} y={178} width={244} height={36} rx={3} fill="#e11d24" />
      <rect x={170} y={244} width={40} height={15} rx={3} fill="#ff4fa8" />
      <rect x={240} y={244} width={30} height={15} rx={2.5} fill="#3bb6ff" />
      <rect x={70} y={232} width={78} height={104} rx={3} fill="#ffb557" />
      <rect x={162} y={232} width={56} height={106} rx={2} fill="#ffcf86" />
      <rect x={232} y={232} width={60} height={104} rx={3} fill="#ffb557" />
      <rect x={336} y={314} width={12} height={30} rx={5} fill="#ffd633" />
      <ellipse cx={64} cy={318} rx={20} ry={8} fill="#ff7aa8" />
    </g>
  )

  return (
    <main className="convenience-root relative isolate min-h-screen overflow-hidden">
      {/* full-bleed SVG scene */}
      <svg
        aria-hidden
        className="convenience-canvas"
        viewBox="0 0 420 760"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* ---- gradients ---- */}
          <linearGradient id={skyGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2438" />
            <stop offset="42%" stopColor="#243149" />
            <stop offset="74%" stopColor="#3a4763" />
            <stop offset="100%" stopColor="#5a5f72" />
          </linearGradient>
          <radialGradient id={haze} cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#c98a4e" stopOpacity={0.4} />
            <stop offset="40%" stopColor="#7d6a59" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#7d6a59" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={waterGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3850" />
            <stop offset="30%" stopColor="#1c2a3c" />
            <stop offset="100%" stopColor="#0e1622" />
          </linearGradient>

          <linearGradient id={brickFill} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a3328" />
            <stop offset="100%" stopColor="#5a241c" />
          </linearGradient>
          <linearGradient id={brickShade} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.45} />
          </linearGradient>
          <linearGradient id={roofGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#171b24" />
            <stop offset="100%" stopColor="#0c0f15" />
          </linearGradient>

          <radialGradient id={interior} cx="50%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#fff0d2" />
            <stop offset="55%" stopColor="#ffcf86" />
            <stop offset="100%" stopColor="#c97f3a" />
          </radialGradient>
          <radialGradient id={winGlow} cx="50%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#fff6e6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ffcf86" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={winGlowSoft} cx="50%" cy="60%" r="70%">
            <stop offset="0%" stopColor="#ffb86b" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ffb86b" stopOpacity={0} />
          </radialGradient>

          <linearGradient id={bannerGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8242b" />
            <stop offset="100%" stopColor="#a3121a" />
          </linearGradient>
          <linearGradient id={bannerSheen} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>

          <linearGradient id={dockGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b4654" />
            <stop offset="100%" stopColor="#222a35" />
          </linearGradient>
          <linearGradient id={dockEdge} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7682" />
            <stop offset="100%" stopColor="#2c343d" />
          </linearGradient>
          <linearGradient id={hydrantGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe25a" />
            <stop offset="55%" stopColor="#f5c211" />
            <stop offset="100%" stopColor="#c79200" />
          </linearGradient>
          <radialGradient id={spill} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffca73" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#ffca73" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={softGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={waterSheen} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fb4d4" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#9fb4d4" stopOpacity={0} />
          </linearGradient>

          {/* ---- still-water displacement (STATIC: no animation) ---- */}
          <filter id={ripple} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.04"
              numOctaves={3}
              seed={11}
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={9}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* vertical smear for the neon streaks */}
          <filter id={streakBlur} x="-30%" y="-10%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4 14" />
          </filter>

          {/* reflection fade mask */}
          <linearGradient id={reflMask} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.85} />
            <stop offset="22%" stopColor="#fff" stopOpacity={0.62} />
            <stop offset="62%" stopColor="#fff" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={streakMask} maskUnits="userSpaceOnUse" x="0" y={WATER_Y} width="420" height={REFL_H}>
            <rect x="0" y={WATER_Y} width="420" height={REFL_H} fill={`url(#${reflMask})`} />
          </mask>
        </defs>

        {/* ===== SKY ===== */}
        <rect x="0" y="0" width="420" height={WATER_Y} fill={`url(#${skyGrad})`} />
        <ellipse cx={120} cy={70} rx={120} ry={22} fill="#3e4a64" opacity={0.4} />
        <ellipse cx={300} cy={110} rx={140} ry={18} fill="#465372" opacity={0.3} />
        <rect x="0" y="220" width="420" height={WATER_Y - 220} fill={`url(#${haze})`} />

        {/* distant shoreline tree-line */}
        <g opacity={0.9}>
          <rect x="0" y={WATER_Y - 14} width="420" height="14" fill="#141d2b" />
          <path
            d="M0 358 Q20 348 40 356 T80 352 T120 355 T160 350 T200 357 T240 351 T280 356 T320 350 T360 357 T400 352 T420 356 L420 372 L0 372 Z"
            fill="#101826"
          />
        </g>

        {/* ===== WATER ===== */}
        <rect x="0" y={WATER_Y} width="420" height={760 - WATER_Y} fill={`url(#${waterGrad})`} />

        {/* ===== REFLECTION (mirrored, displaced, faded) ===== */}
        <g mask={`url(#${streakMask})`}>
          <g transform={`translate(0 ${WATER_Y * 2}) scale(1 -1)`}>
            {/* smeared neon streaks under the structural reflection (screen-blended) */}
            <g
              filter={`url(#${streakBlur})`}
              opacity={0.85}
              transform="scale(1 1.5)"
              style={{ mixBlendMode: 'screen' }}
            >
              {Emitters}
            </g>
            {/* the structural reflection, watery + dim */}
            <g filter={`url(#${ripple})`} opacity={0.7}>
              {StoreScene}
            </g>
            {/* blue + dark wash to push it underwater */}
            <rect
              x="0"
              y={WATER_Y - REFL_H}
              width="420"
              height={REFL_H}
              fill="#0e1c30"
              opacity={0.34}
              style={{ mixBlendMode: 'multiply' }}
            />
          </g>
        </g>

        {/* horizontal ripple highlight lines crossing the reflection */}
        <g opacity={0.5}>
          <rect x="0" y="392" width="420" height="1.4" fill={`url(#${waterSheen})`} />
          <rect x="0" y="430" width="420" height="1.2" fill="#7e95b8" opacity={0.3} />
          <rect x="0" y="486" width="420" height="1" fill="#6a82a6" opacity={0.25} />
          <rect x="0" y="560" width="420" height="1" fill="#5a7196" opacity={0.18} />
        </g>
        {/* specular sheen at the waterline under the dock */}
        <ellipse cx={210} cy={WATER_Y + 6} rx={180} ry={8} fill="#aebfdc" opacity={0.22} />

        {/* ===== UPRIGHT STORE (drawn last, on top) ===== */}
        {StoreScene}

        {/* warm bloom over the whole storefront */}
        <ellipse cx={190} cy={290} rx={160} ry={120} fill={`url(#${softGlow})`} opacity={0.18} />

        {/* buoys floating around the dock */}
        {[
          { x: 30, y: 384, c: '#e2473a' },
          { x: 392, y: 392, c: '#ffce3a' },
          { x: 70, y: 410, c: '#ffce3a' },
          { x: 360, y: 416, c: '#e2473a' },
        ].map((b) => (
          <g key={`buoy-${b.x}-${b.y}`}>
            <ellipse cx={b.x} cy={b.y + 5} rx={8} ry={2.4} fill="#000" opacity={0.3} />
            <circle cx={b.x} cy={b.y} r={5.5} fill={b.c} />
            <rect x={b.x - 5.5} y={b.y - 1.4} width={11} height={2.8} fill="#f3f3f3" opacity={0.85} />
            <circle cx={b.x} cy={b.y} r={5.5} fill="none" stroke="#00000040" strokeWidth={1} />
            <ellipse cx={b.x} cy={b.y + 11} rx={4} ry={6} fill={b.c} opacity={0.18} />
          </g>
        ))}
      </svg>

      {/* vignette + atmosphere on top of the canvas */}
      <div aria-hidden className="convenience-vignette" />

      {/* ===== OVERLAY CONTENT (kept off the store, top-left) ===== */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:py-16">
        <div className="convenience-overlay max-w-md">
          <m.p
            {...rise(0.05)}
            className="convenience-eyebrow font-mono text-[0.7rem] uppercase tracking-[0.34em]"
          >
            <span className="convenience-eyebrow-dot" />
            Open for work · Software Engineer
          </m.p>

          <m.p
            {...rise(0.16)}
            className="convenience-tagline mt-5 font-sans text-base leading-relaxed sm:text-lg"
          >
            Building resilient distributed systems — Spring Boot, Postgres, Redis
            &amp; Kafka. Open late, always stocked, always shipping.
          </m.p>

          <m.div {...rise(0.28)} className="mt-7 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="convenience-cta convenience-cta--primary font-mono text-xs font-semibold uppercase tracking-[0.16em]"
            >
              View projects
            </a>
            <a
              href="#about"
              className="convenience-cta convenience-cta--ghost font-mono text-xs font-semibold uppercase tracking-[0.16em]"
            >
              About
            </a>
          </m.div>
        </div>
      </div>
    </main>
  )
}
