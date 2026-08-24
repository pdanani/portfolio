# NYC eats map

A personal page: a Google Map of favorite NYC restaurants, each pin with a
short note (what to order, why it's on the list). Teased from the About
section ("more on that soon"); not built yet — this doc scopes it before we
start.

## Placement

- Own route, **`/eats`** (file: `apps/web/src/routes/eats.tsx`), same pattern
  as the old `/costco` page — kept out of the one-pager's scroll.
- About section links to it once it exists (currently just teases with
  "more on that soon" — see [about.tsx](../apps/web/src/components/sections/about.tsx)).
- Unlike `/costco`, this needs **no backend** — Maps JS API calls run
  entirely client-side, so it deploys fine as a static page on GitHub Pages
  (no Vercel/API-route dependency).

## Map

- **Google Maps JavaScript API**, embedded and styled to match the site
  (dark/night map style to sit with the `night-sea` palette, not Google's
  default light theme).
- Pins driven by a small typed data file in this repo (`src/data/eats.ts`
  or similar), not Google My Maps — keeps the list versioned with the site
  and editable the same way `projects.ts` / `experience.ts` are.
- Rough shape per pin:
  ```ts
  interface EatsPin {
    name: string
    neighborhood: string
    coords: { lat: number; lng: number }
    note: string // what to order / why it's here
    tags?: Array<string> // e.g. ['ramen', 'late-night']
  }
  ```

## API key

- Restrict by **HTTP referrer** in Google Cloud Console, scoped to
  `pdanani.github.io/*` (and `localhost` for dev) — standard for
  client-side Maps embeds. The key is public in the bundle either way since
  this is a static site with no server to hide it behind; the referrer
  restriction is what actually limits abuse.
- Key goes in an env var read at build time (`VITE_GOOGLE_MAPS_KEY` or
  similar), not hardcoded, so it's easy to rotate.

## Open items

- Exact route name (`/eats` vs `/map` vs something else).
- First batch of pins + notes (the user's actual list).
- Whether the page gets any of the site's other chrome (nav back to `/`,
  footer) or stays a minimal standalone page.
- Map visual style to match `night-sea` — needs a Google Maps JSON style
  config, not just a CSS filter over the iframe.
