import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

/* Set (e.g. to '/portfolio/') by `npm run build:pages` for the GitHub
   Pages artifact: assets and the router get the subpath prefix. The
   static HTML itself is snapshotted from the built SSR server by
   scripts/deploy-pages.sh. Unset for the normal SSR (Vercel) build. */
const pagesBase = process.env.PAGES_BASE

const config = defineConfig({
  base: pagesBase,
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
