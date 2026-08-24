# Pawan Danani — Portfolio

A personal portfolio and, over time, a home for distributed-systems "lab" projects.
Rebuilt from scratch (the old Next.js 13 site is retired and deleted; it lives in
git history) on a modern, type-safe, serverless stack. Currently on the
**`revamp`** branch.

**The hero:** the **Ocean Waves** scene — a raw-WebGL twilight sea with a
noon→dusk sun-arc intro and the name spelled in soft (SVG-filter) clouds.

**Live:** https://pawandanani.com (Vercel — auto-deploys from `main`).
Legacy GitHub Pages copy: https://pdanani.github.io/portfolio/

The Costco tracker (**Warehouse Watch**) used to live here at `/costco`; it's
been extracted to its own repo ([`pdanani/warehouse-watch-app`](https://github.com/pdanani/warehouse-watch-app))
and deploys independently at https://warehouse-watch-app.vercel.app — see
that repo for its own setup. This repo no longer depends on Neon/Drizzle at all.

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
| Hosting         | **Vercel**, Git-connected — every push to `main` deploys to pawandanani.com |
| Backend (later) | **Java Spring Boot 4** lab services behind a TanStack Start server-fn BFF |

Run locally:

```bash
npm install
npm run dev -w apps/web              # dev server
npm run build -w apps/web            # production build
npx tsc -p apps/web/tsconfig.json    # type-check (kept green)
```

---

## Deploying

### pawandanani.com via Vercel (live since 2026-08-23)

The Vercel project `portfolio-web` (linked in `.vercel/project.json`, root
directory `apps/web`) is Git-connected to this repo with **`main` as the
production branch**: every push to `main` deploys to pawandanani.com; a push
to any other branch gets a preview URL. That Git integration *is* the
pipeline — no GitHub Actions involved. Work on a branch, then fast-forward
or merge into `main` to ship.

DNS lives at Squarespace Domains: `@` → A `216.198.79.1`, `www` → CNAME
`249406d76d6f9cac.vercel-dns-017.com`. Those values are project-specific
(Vercel issued them); `npx vercel domains verify pawandanani.com` re-checks.
The `d5rtplbwemtn` CNAME there is a Google ownership-verification record —
leave it.

### GitHub Pages (legacy)

```bash
./scripts/deploy-pages.sh
```

Builds with `PAGES_BASE=/portfolio/`, snapshots the SSR-rendered home page,
and force-pushes the static artifact to `gh-pages` →
https://pdanani.github.io/portfolio/. Superseded by the Vercel deploy above;
kept as a fallback. (Each run also triggers a failed Vercel preview build for
the `gh-pages` branch — harmless.)

### How the apex was cut over (reference)

pawandanani.com used to serve the old Next.js site from Firebase Hosting
(apex A record `199.36.158.100`). The steps that moved it, in order:

1. **Authenticate** (one-time, opens the browser):
   ```bash
   npx vercel login
   ```
2. **Deploy, then attach the domain to the project** (from the repo root —
   the directory is already linked to `portfolio-web`; subdomains need the
   project name, the apex accepts it too):
   ```bash
   npx vercel --prod
   npx vercel domains add pawandanani.com portfolio-web
   npx vercel domains add www.pawandanani.com portfolio-web
   npx vercel domains verify pawandanani.com   # prints the exact records to set
   ```
   Use the records `verify` prints, not generic ones from docs — Vercel
   assigns per-project anycast IPs now, and verification checks for the
   exact values it expects.
3. **Update DNS** at Squarespace Domains (the zone still uses Google Cloud
   DNS nameservers, `ns-cloud-e*.googledomains.com`; leave those alone —
   only the records change, so no DNSSEC risk). Replace the two Firebase
   records:
   - `@` (apex): A `199.36.158.100` → **A `216.198.79.1`**
   - `www`: delete the A record → **CNAME `249406d76d6f9cac.vercel-dns-017.com`**

   Verified within minutes; SSL issued automatically.
4. **Cleanup (optional):** in the Firebase console, remove the custom
   domain from the old hosting project, then retire the Firebase project.

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

- **Resume sections shipped (2026-08-16)** — the home page is now a full
  one-pager: Experience (timeline with amber "harbor-light" markers),
  Selected projects (glass cards), and Toolbox (skill chips) — contact is
  folded into the hero (email + LinkedIn) with a slim closing footer —
  all on a `night-sea` gradient that continues the hero's sea into night
  (with the set sun's afterglow bleeding past the waterline at the same x).
  Subtle SVG wave dividers between sections; reveals via the existing
  motion primitives; hero CTAs + scroll cue wired to section anchors.
- **Content migrated to typed data (2026-08-16)** — `data/data.json` →
  `apps/web/src/data/*.ts` (strict-TS checked, tech as arrays, per-project
  `slug` + optional `liveUrl` reserved for hosting live apps under this
  domain later). The JSON stays only as the archival source.

### ❌ Not built yet (Phase 2+)
Separate routes (`/projects/$slug` for app/writeup pages), nav, page
transitions, MDX writeups, TanStack Query data fetching, installed UI
components (shadcn vs Mantine still open), the BFF server-fn layer.

---

## Plan

### Phase 2 — the app shell
- Routes: `/about`, `/projects`, `/projects/$slug`; `SiteNav` + `MobileNav`
  (sheet) + `Footer` in `__root`; `AnimatedOutlet` page transitions
  (reduced-motion safe).
- Add UI primitives (button, card, badge, navigation-menu, sheet, …) —
  shadcn/ui unless the Mantine question is resolved otherwise.
- Per-route `head` meta (SEO), sitemap/robots, default OG image.

### Phase 3 — content depth
- MDX (`@mdx-js/rollup` + remark/rehype) for project writeups at
  `/projects/$slug`; the `slug` field in `src/data/projects.ts` is the hook.
- Add the real Gesture Swiping Decoder repo URL (old data had a placeholder;
  its card ships without a link until then).

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
├─ routes/            __root, index (hero + sections one-pager)
├─ components/
│  ├─ waves-hero.tsx  the Ocean Waves hero (shader + overlay)
│  ├─ sections/       Section/SectionHeading, Experience, Projects, Skills
│  ├─ chip.tsx        tech-tag pill · wave-divider.tsx · site-footer.tsx
│  └─ motion/         Reveal, StaggerGroup, Parallax, scroll progress
├─ data/              typed resume content (profile, experience, projects, skills)
├─ lib/               cn(), formatMonth/Range, motion variants + provider
└─ styles.css         Tailwind v4 + OKLCH tokens + waves/night-sea classes
data/data.json        archival source of the migrated content
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
