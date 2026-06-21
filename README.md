# Pawan Danani — Portfolio

A personal portfolio and, over time, a home for distributed-systems "lab" projects.
Rebuilt from scratch (the old Next.js 13 site is retired) on a modern, type-safe,
serverless stack. Currently on the **`revamp`** branch.

**Chosen hero:** the **Ocean Waves** kit — a raw-WebGL twilight sea with a
noon→dusk sun-arc intro and the name spelled in soft (SVG-filter) clouds.
Live preview: https://portfolio-web-ruddy-pi.vercel.app

---

## Tech stack

| Concern         | Choice |
| --------------- | ------ |
| Framework       | **TanStack Start** (React 19 + Vite + Nitro), file-based **TanStack Router** |
| Language        | **TypeScript**, `strict` + `noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` |
| Styling         | **Tailwind v4** (CSS-first, OKLCH tokens, `@theme inline`) |
| UI primitives   | **shadcn/ui** building blocks (cva, clsx, tailwind-merge, lucide-react) |
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

## Status (2026-06-21)

### ✅ Done & professional
- **Phase 0** — monorepo scaffold, TanStack Start, Tailwind v4, strict TS, legacy
  deps removed (no `three`/`vanta`/MUI/`next`).
- **Phase 1** — OKLCH design-token system, motion primitives (`Reveal`,
  `StaggerGroup`, `Parallax`, scroll progress), CSS aurora background, global
  reduced-motion safety net.
- **Ocean Waves hero** (`components/concepts/waves-hero.tsx`) — built properly:
  WebGL with context-loss handling / `raf` + resource cleanup, a CSS fallback
  path, reduced-motion handling, an accessible in-flow `<h1>`, no-flash theming.

### ⚠️ Tech debt from the design-kit exploration (to clean up)
We explored ~30 hero "kits" to pick a look. That served its purpose, but left
demo-grade cruft that must not ship as-is:
- **All ~32 hero components are bundled.** `components/concepts/index.ts` imports
  every kit into one `CONCEPTS` map, so the production bundle ships 30+ unused
  designs to render one.
- **`styles.css` is ~9,440 lines** and contains **duplicated kit blocks** from
  iterative splices — `waves8bit`, `space`, `jukebox` each appear **3×**; the
  active `waves` block exists **2×** (lines ~7415 and ~9304); `convenience` 2×.
- **`.waves-fallback` is referenced by the hero but never defined in CSS** — if
  WebGL fails there is no sky/sea fallback (a real gap).
- 9 commented-out kit entries in `lib/kits.ts`; a shipped `/styleguide` dev route;
  TanStack devtools sitting in `dependencies` instead of `devDependencies`.

### ❌ Not built yet (the real site — Phase 2+)
Still a single hero page. None of these exist: real routes (`/about`,
`/projects`, `/projects/$slug`), nav, footer, page transitions, a content model
(zod schemas / labs registry), migration of the old `data.json` (7 projects +
experience), MDX (not even installed), any TanStack Query data fetching, any
shadcn components, or the BFF server-fn layer.

---

## Plan

### Step 1 — Archive the design exploration (decided: ship only Ocean Waves)
Move everything except Ocean Waves into `apps/web/src/_archive/` (kept in the repo
for reference, **excluded from the build** via `tsconfig` `exclude`; unimported, so
tree-shaken from the bundle).

- **Relocate to `_archive/`:** every `components/concepts/*-hero.tsx` **except**
  `waves-hero.tsx`, plus `ocean-shader.tsx`, `components/concepts/index.ts`
  (the `CONCEPTS` map), `lib/kits.ts`, `lib/kit-context.tsx`, and
  `components/theme-switcher.tsx`.
- **Carve `styles.css`:** keep the base layer (tokens, `@theme`, reduced-motion
  net, utilities) + the **single** canonical `waves` block; move all other kit
  blocks to `_archive/archived-kits.css` (unimported). Fix while in there:
  **dedupe** the repeated blocks and **add the missing `.waves-fallback`** rule.
- **Rewire the app:**
  - `routes/index.tsx` → render `<WavesHero/>` directly (drop `useKit`/`CONCEPTS`).
  - `routes/__root.tsx` → set `data-kit="waves"` statically on `<html>`, remove the
    no-flash script, `KitProvider`, and `ThemeSwitcher`.
- **Keep:** `lib/motion/*`, `components/motion/*`, `Aurora`, `MotionProvider`,
  base tokens, `waves-hero.tsx`.
- **Verify:** `tsc` clean + build; confirm the bundle drops the ~30 heroes.

### Step 2 — Phase 2: the app shell (the real site)
- Routes: `/about`, `/projects`, `/projects/$slug`; `SiteNav` + `MobileNav` (sheet)
  + `Footer` in `__root`; `AnimatedOutlet` page transitions (reduced-motion safe).
- Add shadcn primitives (button, card, badge, navigation-menu, sheet, …).
- Per-route `head` meta (SEO), sitemap/robots, default OG image.
- Move TanStack devtools to `devDependencies`; drop `/styleguide` from prod (or gate dev-only).

### Step 3 — Phase 3: content model & migration
- `labs/types.ts` + **zod** `LabProject` schema; `labs/registry.ts`.
- Migrate `data.json` → typed `data/*.ts` (split `tech` strings → arrays, generate
  slugs, fix the placeholder repo URL, carry experience/skills).
- Install MDX (`@mdx-js/rollup` + remark/rehype) for project writeups.

### Step 4 — Phase 4: pages & signature moments
- Home (Ocean Waves hero + featured projects), Projects grid, project detail
  (MDX writeup + tech tags + diagram), About (experience timeline + skills + resume).
- One-time intro: the sun-arc replays on every load today — gate it to **once per
  session** (`sessionStorage`) so repeat visits are instant.

### Step 5 — Phase 5: labs & BFF (when a real backend idea lands)
- `services/<slug>` Spring Boot 4 monolith; `server/` `createServerFn` BFF that
  proxies/wakes it; cost-aware live-demo UX (`live` / `scale-to-zero` / `offline`).

---

## Structure

```
apps/web/src/
├─ routes/            __root, index (Ocean Waves), styleguide
├─ components/
│  ├─ concepts/       hero components (waves-hero kept; rest → _archive)
│  ├─ motion/         Reveal, StaggerGroup, Parallax, scroll progress
│  └─ backgrounds/    Aurora
├─ lib/               motion variants, (kit infra → _archive)
└─ styles.css         Tailwind v4 + OKLCH tokens + the waves kit
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
