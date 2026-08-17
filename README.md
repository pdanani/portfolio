# Pawan Danani — Portfolio

A personal portfolio and, over time, a home for distributed-systems "lab" projects.
Rebuilt from scratch (the old Next.js 13 site is retired and deleted; it lives in
git history) on a modern, type-safe, serverless stack. Currently on the
**`revamp`** branch.

**The hero:** the **Ocean Waves** scene — a raw-WebGL twilight sea with a
noon→dusk sun-arc intro and the name spelled in soft (SVG-filter) clouds.
Live preview: https://portfolio-web-ruddy-pi.vercel.app

---

## Tech stack

| Concern         | Choice |
| --------------- | ------ |
| Framework       | **TanStack Start** (React 19 + Vite + Nitro), file-based **TanStack Router** |
| Language        | **TypeScript**, `strict` + `noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` |
| Styling         | **Tailwind v4** (CSS-first, OKLCH tokens, `@theme inline`) |
| UI primitives   | **shadcn/ui** conventions scaffolded (cn/cva, token layout); no components installed yet |
| Data            | **TanStack Query** (+ Start SSR integration) |
| Motion          | **`motion` v12** via `LazyMotion` + `m`, every primitive gated on `useReducedMotion()` |
| Repo            | **npm workspaces** monorepo (`apps/web`; `services/<slug>` later) |
| Hosting         | **Vercel** (deployed manually via `vercel --prod`) |
| Backend (later) | **Java Spring Boot 4** lab services behind a TanStack Start server-fn BFF |

Run locally:

```bash
npm install
npm run dev -w apps/web              # dev server
npm run build -w apps/web            # production build
npx tsc -p apps/web/tsconfig.json    # type-check (kept green)
```

---

## Status (2026-08-16)

### ✅ Done
- **Phase 0** — monorepo scaffold, TanStack Start, Tailwind v4, strict TS.
- **Phase 1** — OKLCH design-token system, motion primitives (`Reveal`,
  `StaggerGroup`, `Parallax`, scroll progress), global reduced-motion safety net.
- **Design exploration resolved** — ~30 hero "kits" were built to pick a look;
  Ocean Waves won. Everything else (kit switcher, per-kit CSS, the other hero
  components, the retired Next.js site at the repo root) is deleted — git
  history keeps it. `styles.css` went from ~9,440 lines to ~150.
- **Ocean Waves hero hardened** (`components/waves-hero.tsx`):
  - fragment shader falls back to `mediump` where `highp` is unsupported
    (older mobile GPUs previously failed to compile → blank page);
  - a real `.waves-fallback` CSS dusk scene shows whenever WebGL is
    unavailable, software-rendered (`failIfMajorPerformanceCaveat`), or lost;
  - GPU context-loss recovery (hide canvas → fallback; re-init on restore);
  - device-pixel-ratio capped at 1.5 and no per-frame layout reads;
  - intro animates compositor-only properties (no CSS blur over the
    filter-heavy SVG clouds);
  - fonts trimmed from 13 Google families to 3, loaded via preconnected
    `<link>` instead of a CSS `@import`;
  - TanStack devtools moved to `devDependencies`; `/styleguide` route removed.

### ❌ Not built yet (the real site — Phase 2+)
Still a single hero page. None of these exist: real routes (`/about`,
`/projects`, `/projects/$slug`), nav, footer, page transitions, a content model
(zod schemas / labs registry), migration of the old `data.json` (7 projects +
experience, kept at `data/data.json`), MDX (not installed), any TanStack Query
data fetching, any installed UI components, or the BFF server-fn layer.

---

## Plan

### Phase 2 — the app shell
- Routes: `/about`, `/projects`, `/projects/$slug`; `SiteNav` + `MobileNav`
  (sheet) + `Footer` in `__root`; `AnimatedOutlet` page transitions
  (reduced-motion safe).
- Add UI primitives (button, card, badge, navigation-menu, sheet, …) —
  shadcn/ui unless the Mantine question is resolved otherwise.
- Per-route `head` meta (SEO), sitemap/robots, default OG image.

### Phase 3 — content model & migration
- `labs/types.ts` + **zod** `LabProject` schema; `labs/registry.ts`.
- Migrate `data/data.json` → typed `data/*.ts` (split `tech` strings → arrays,
  generate slugs, fix the placeholder repo URL, carry experience/skills).
- Install MDX (`@mdx-js/rollup` + remark/rehype) for project writeups.

### Phase 4 — pages & signature moments
- Home (Ocean Waves hero + featured projects), Projects grid, project detail
  (MDX writeup + tech tags + diagram), About (experience timeline + skills +
  resume).
- One-time intro: the sun-arc replays on every load today — gate it to **once
  per session** (`sessionStorage`) so repeat visits are instant.

### Phase 5 — labs & BFF (when a real backend idea lands)
- `services/<slug>` Spring Boot 4 monolith; `server/` `createServerFn` BFF that
  proxies/wakes it; cost-aware live-demo UX (`live` / `scale-to-zero` /
  `offline`).

---

## Structure

```
apps/web/src/
├─ routes/            __root, index (renders WavesHero)
├─ components/
│  ├─ waves-hero.tsx  the Ocean Waves hero (shader + overlay)
│  └─ motion/         Reveal, StaggerGroup, Parallax, scroll progress
├─ lib/               cn(), motion variants + provider
└─ styles.css         Tailwind v4 + OKLCH tokens + waves helper classes
data/data.json        old-site content awaiting Phase 3 migration
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
