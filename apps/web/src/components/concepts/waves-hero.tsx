import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/**
 * Ocean Waves — a hand-illustrated, flat / cel "anime" twilight seascape.
 *
 * The art is built entirely from inline SVG + CSS (NO WebGL): a preserved dusk
 * sky (indigo -> violet -> rose with a warm sun glow + disc) over layered,
 * cel-shaded wave bands in navy / indigo / teal, chunky cream foam caps, foam
 * blobs and curling swirls, a bold curling foreground crest, and a shimmering
 * warm sun-glint on the water. A faint headland adds depth.
 *
 * Camera is fixed (no pan / zoom): bands drift sideways, foam bobs, the glint
 * shimmers and the foreground crest gently breathes. `useReducedMotion`
 * freezes every loop in a visible resting state.
 */
export function WavesHero() {
  const reduce = useReducedMotion()

  // Looping group animation that collapses to a static resting frame when the
  // user prefers reduced motion.
  const drift = (
    x: [number, number, number],
    duration: number,
    delay = 0,
  ) =>
    reduce
      ? undefined
      : {
          animate: { x },
          transition: {
            duration,
            delay,
            ease: 'easeInOut' as const,
            repeat: Infinity,
            repeatType: 'mirror' as const,
          },
        }

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* ============================ SCENE ============================ */}
      <div aria-hidden className="absolute inset-0 -z-20">
        {/* Preserved dusk sky — CSS gradient base */}
        <div className="waves-sky absolute inset-0" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* warm sun glow */}
            <radialGradient id="waves-sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.92 0.13 75)" stopOpacity="0.95" />
              <stop offset="28%" stopColor="oklch(0.85 0.16 70)" stopOpacity="0.62" />
              <stop offset="62%" stopColor="oklch(0.66 0.17 45)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="oklch(0.55 0.16 25)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="waves-sun-disc" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="oklch(0.97 0.06 85)" />
              <stop offset="60%" stopColor="oklch(0.88 0.15 72)" />
              <stop offset="100%" stopColor="oklch(0.8 0.16 60)" stopOpacity="0.9" />
            </radialGradient>
            {/* warm glint column under the sun */}
            <linearGradient id="waves-glint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.9 0.13 72)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="oklch(0.78 0.15 55)" stopOpacity="0" />
            </linearGradient>
            {/* cel water tones (flat fills + one tonal band each) */}
            <linearGradient id="waves-band-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.46 0.07 240)" />
              <stop offset="100%" stopColor="oklch(0.36 0.07 244)" />
            </linearGradient>
          </defs>

          {/* ---- SUN GLOW + DISC (just above horizon, right of centre) ---- */}
          <rect
            x="540"
            y="120"
            width="780"
            height="560"
            fill="url(#waves-sun-glow)"
          />
          <circle cx="850" cy="338" r="46" fill="url(#waves-sun-disc)" />
          <circle
            cx="850"
            cy="338"
            r="46"
            fill="none"
            stroke="oklch(0.96 0.07 85)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* ---- distant headland silhouette (depth) ---- */}
          <path
            d="M0 372 C 70 360 120 350 190 356 C 250 361 286 372 340 372 L 340 384 L 0 384 Z"
            fill="oklch(0.2 0.06 268)"
            fillOpacity="0.85"
          />

          {/* ---- crisp horizon + warm rim ---- */}
          <rect x="0" y="372" width="1440" height="2.5" fill="oklch(0.9 0.12 60)" fillOpacity="0.7" />
          <rect x="0" y="374.5" width="1440" height="8" fill="oklch(0.4 0.1 285)" fillOpacity="0.45" />

          {/* ============== WATER — cel-shaded layered wave bands ============== */}

          {/* far band, just under the horizon */}
          <m.g {...drift([-26, 18, -26], 17)}>
            <path
              d="M-60 384
                 C 180 372 340 392 560 382
                 C 780 372 980 394 1180 384
                 C 1320 378 1440 388 1520 384
                 L 1520 430 L -60 430 Z"
              fill="url(#waves-band-far)"
            />
            {/* tiny foam ticks on the far crest */}
            <g fill="oklch(0.92 0.02 230)" fillOpacity="0.85">
              <ellipse cx="300" cy="383" rx="16" ry="3" />
              <ellipse cx="690" cy="380" rx="20" ry="3.4" />
              <ellipse cx="1080" cy="386" rx="15" ry="3" />
            </g>
          </m.g>

          {/* mid-far band */}
          <m.g {...drift([22, -16, 22], 14, 0.4)}>
            <path
              d="M-60 420
                 C 200 402 380 430 620 414
                 C 860 398 1060 428 1280 414
                 C 1380 408 1480 418 1520 416
                 L 1520 486 L -60 486 Z"
              fill="oklch(0.32 0.075 246)"
            />
            {/* tonal cel band */}
            <path
              d="M-60 420
                 C 200 402 380 430 620 414
                 C 860 398 1060 428 1280 414
                 C 1380 408 1480 418 1520 416
                 L 1520 438 C 1300 446 1100 432 860 444
                 C 620 456 380 436 -60 452 Z"
              fill="oklch(0.4 0.085 240)"
              fillOpacity="0.55"
            />
            {/* warm-tinted foam near the sun, cooler elsewhere */}
            <g className="waves-foam">
              <ellipse cx="780" cy="411" rx="34" ry="6" fill="oklch(0.95 0.05 78)" fillOpacity="0.92" />
              <ellipse cx="900" cy="417" rx="26" ry="5" fill="oklch(0.95 0.06 72)" fillOpacity="0.88" />
              <ellipse cx="380" cy="418" rx="30" ry="5.5" fill="oklch(0.95 0.01 230)" fillOpacity="0.85" />
              <ellipse cx="1180" cy="416" rx="26" ry="5" fill="oklch(0.95 0.01 230)" fillOpacity="0.8" />
              <ellipse cx="150" cy="430" rx="22" ry="4.5" fill="oklch(0.95 0.01 230)" fillOpacity="0.7" />
            </g>
          </m.g>

          {/* mid band */}
          <m.g {...drift([-30, 22, -30], 12, 0.2)}>
            <path
              d="M-60 470
                 C 240 446 460 482 720 462
                 C 980 442 1180 480 1420 462
                 C 1480 458 1520 464 1540 462
                 L 1540 560 L -60 560 Z"
              fill="oklch(0.26 0.075 250)"
            />
            <path
              d="M-60 470
                 C 240 446 460 482 720 462
                 C 980 442 1180 480 1420 462
                 C 1480 458 1520 464 1540 462
                 L 1540 502 C 1240 514 980 492 700 506
                 C 420 520 200 498 -60 512 Z"
              fill="oklch(0.34 0.085 244)"
              fillOpacity="0.6"
            />
            {/* foam caps + curling swirls clustered at the breaks */}
            <g className="waves-foam">
              {/* warm cluster under the sun */}
              <ellipse cx="820" cy="458" rx="46" ry="8" fill="oklch(0.96 0.05 76)" fillOpacity="0.95" />
              <circle cx="788" cy="455" r="9" fill="oklch(0.97 0.04 78)" fillOpacity="0.95" />
              <circle cx="856" cy="456" r="7" fill="oklch(0.97 0.05 74)" fillOpacity="0.9" />
              <path
                d="M866 456 C 878 448 894 450 898 460 C 892 456 882 456 876 462 C 882 458 890 460 892 466 C 884 462 872 462 866 456 Z"
                fill="oklch(0.97 0.04 78)"
                fillOpacity="0.92"
              />
              {/* cool clusters */}
              <ellipse cx="440" cy="466" rx="40" ry="7" fill="oklch(0.95 0.012 228)" fillOpacity="0.9" />
              <circle cx="408" cy="463" r="8" fill="oklch(0.96 0.012 228)" fillOpacity="0.9" />
              <path
                d="M470 464 C 482 456 498 458 502 468 C 496 464 486 464 480 470 C 486 466 494 468 496 474 C 488 470 476 470 470 464 Z"
                fill="oklch(0.96 0.012 228)"
                fillOpacity="0.88"
              />
              <ellipse cx="1230" cy="464" rx="38" ry="7" fill="oklch(0.95 0.012 228)" fillOpacity="0.85" />
              <circle cx="1262" cy="461" r="7" fill="oklch(0.96 0.012 228)" fillOpacity="0.85" />
            </g>
          </m.g>

          {/* near band */}
          <m.g {...drift([26, -20, 26], 10.5, 0.5)}>
            <path
              d="M-60 540
                 C 260 508 520 552 800 526
                 C 1080 500 1260 548 1540 524
                 L 1540 640 L -60 640 Z"
              fill="oklch(0.2 0.07 254)"
            />
            <path
              d="M-60 540
                 C 260 508 520 552 800 526
                 C 1080 500 1260 548 1540 524
                 L 1540 576 C 1240 590 980 566 700 582
                 C 420 598 180 572 -60 588 Z"
              fill="oklch(0.28 0.08 248)"
              fillOpacity="0.6"
            />
            <g className="waves-foam">
              <ellipse cx="840" cy="524" rx="58" ry="9" fill="oklch(0.97 0.045 76)" fillOpacity="0.92" />
              <circle cx="800" cy="521" r="10" fill="oklch(0.97 0.04 78)" fillOpacity="0.92" />
              <ellipse cx="520" cy="532" rx="48" ry="8" fill="oklch(0.96 0.012 228)" fillOpacity="0.88" />
              <circle cx="556" cy="529" r="9" fill="oklch(0.96 0.012 228)" fillOpacity="0.88" />
              <ellipse cx="1160" cy="528" rx="50" ry="8" fill="oklch(0.96 0.012 228)" fillOpacity="0.82" />
              <path
                d="M1196 525 C 1210 516 1228 518 1232 530 C 1224 525 1212 525 1206 532 C 1213 528 1222 530 1224 537 C 1214 532 1202 532 1196 525 Z"
                fill="oklch(0.96 0.012 228)"
                fillOpacity="0.85"
              />
            </g>
          </m.g>

          {/* ----------- shimmering warm sun-glint reflection ----------- */}
          <g className="waves-glint-group">
            <rect
              x="760"
              y="376"
              width="180"
              height="170"
              fill="url(#waves-glint)"
              opacity="0.55"
            />
            <g fill="oklch(0.93 0.1 72)">
              <ellipse className="waves-glint-1" cx="852" cy="404" rx="44" ry="3" opacity="0.8" />
              <ellipse className="waves-glint-2" cx="850" cy="428" rx="60" ry="3.4" opacity="0.7" />
              <ellipse className="waves-glint-3" cx="846" cy="456" rx="74" ry="4" opacity="0.6" />
              <ellipse className="waves-glint-1" cx="848" cy="486" rx="90" ry="4.4" opacity="0.5" />
              <ellipse className="waves-glint-2" cx="850" cy="516" rx="104" ry="5" opacity="0.42" />
            </g>
          </g>

          {/* ================ BOLD FOREGROUND CURLING CREST ================ */}
          <m.g
            className="waves-crest"
            {...(reduce
              ? undefined
              : {
                  animate: { y: [0, -7, 0], scaleY: [1, 1.03, 1] },
                  transition: {
                    duration: 6.5,
                    ease: 'easeInOut' as const,
                    repeat: Infinity,
                    repeatType: 'mirror' as const,
                  },
                })}
            style={{ transformOrigin: '420px 760px' }}
          >
            {/* dark face of the breaking wave */}
            <path
              d="M-60 760
                 C 120 700 300 690 460 720
                 C 560 738 650 742 740 712
                 C 700 770 600 800 470 792
                 C 360 786 240 800 120 840
                 C 40 866 -20 880 -60 880 Z"
              fill="oklch(0.16 0.07 256)"
            />
            {/* tonal cel highlight inside the curl */}
            <path
              d="M120 752
                 C 260 712 380 706 480 728
                 C 558 745 626 748 700 726
                 C 666 762 600 778 500 772
                 C 408 767 300 776 200 802
                 C 168 812 140 820 120 824 Z"
              fill="oklch(0.27 0.085 246)"
              fillOpacity="0.85"
            />
            {/* the curling lip — thick cream foam */}
            <path
              d="M-60 758
                 C 130 698 312 688 470 718
                 C 556 734 642 740 726 714
                 C 742 709 754 706 762 708
                 C 740 726 706 736 660 740
                 C 588 746 520 738 452 730
                 C 322 714 168 720 36 760
                 C 4 770 -28 778 -60 780 Z"
              fill="oklch(0.97 0.02 86)"
              fillOpacity="0.96"
            />
            {/* curling foam swirls along the lip */}
            <g className="waves-foam" fill="oklch(0.98 0.025 84)">
              <path
                d="M236 716 C 256 700 286 702 294 720 C 282 711 264 712 252 724 C 266 716 282 720 286 732 C 270 723 248 724 236 716 Z"
                fillOpacity="0.95"
              />
              <path
                d="M430 720 C 452 704 484 706 492 726 C 478 716 458 717 446 730 C 462 721 480 726 484 738 C 466 728 442 729 430 720 Z"
                fillOpacity="0.95"
              />
              <circle cx="150" cy="730" r="13" fillOpacity="0.95" />
              <circle cx="178" cy="724" r="9" fillOpacity="0.9" />
              <circle cx="560" cy="722" r="11" fillOpacity="0.92" />
              <circle cx="338" cy="715" r="10" fillOpacity="0.9" />
              <circle cx="640" cy="724" r="8" fillOpacity="0.85" />
            </g>
            {/* scattered foam droplets above the crest */}
            <g className="waves-foam" fill="oklch(0.98 0.02 84)">
              <circle cx="300" cy="690" r="4.5" fillOpacity="0.8" />
              <circle cx="470" cy="694" r="5" fillOpacity="0.8" />
              <circle cx="210" cy="700" r="3.6" fillOpacity="0.7" />
              <circle cx="560" cy="700" r="4" fillOpacity="0.7" />
              <circle cx="386" cy="684" r="3.4" fillOpacity="0.65" />
            </g>
          </m.g>
        </svg>
      </div>

      {/* bottom-up scrim so the headline + CTAs stay AA over the bright water */}
      <div
        aria-hidden
        className="waves-scrim pointer-events-none absolute inset-0 -z-10"
      />

      {/* ============================ CONTENT ============================ */}
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-16 pt-24 sm:pb-24">
        <m.p
          {...rise(0.05)}
          className="font-mono text-xs uppercase tracking-[0.42em] text-brand-amber sm:text-sm"
        >
          Backend Engineer
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="waves-title mt-5 font-display text-6xl font-semibold tracking-tight text-foreground sm:text-8xl"
        >
          Pawan Danani
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg"
        >
          I build resilient distributed systems that stay afloat under load —
          <span className="text-brand-amber"> Spring Boot</span>,
          <span className="text-foreground"> Postgres</span>,
          <span className="text-brand-cyan"> Redis</span> and
          <span className="text-foreground"> Kafka</span>, engineered for
          failure and tuned for the storm.
        </m.p>

        <m.div {...rise(0.4)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="rounded-[0.4rem] bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{
              boxShadow:
                '0 8px 30px color-mix(in oklab, var(--primary) 45%, transparent)',
            }}
          >
            View projects
          </a>
          <a
            href="#"
            className="waves-glass rounded-[0.4rem] border border-border px-7 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
