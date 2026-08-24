import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { MotionProvider } from '#/lib/motion/motion-provider'

import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/* Only the families the site uses, loaded as <link> (with preconnect)
   rather than a CSS @import so discovery isn't serialised behind the
   stylesheet. Press Start 2P is the Gaming easter egg's pixel font: its
   @font-face is declared here but the file only downloads the first time
   the overlay renders text in it. */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Space+Grotesk:wght@300..700&family=Press+Start+2P&display=swap'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Dark-only site: tell the browser (form controls, scrollbars) and
      // opt out of Dark Reader, which inverts the white SVG name-clouds and
      // dims the shader canvas.
      { name: 'color-scheme', content: 'dark' },
      { name: 'darkreader-lock' },
      { title: 'Pawan Danani — Software Engineer' },
      {
        name: 'description',
        content: 'Software engineer based in NYC.',
      },
    ],
    links: [
      // BASE_URL-prefixed so the GitHub Pages subpath build finds them
      {
        rel: 'icon',
        href: `${import.meta.env.BASE_URL}favicon.svg`,
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        href: `${import.meta.env.BASE_URL}favicon.ico`,
        sizes: '256x256',
      },
      {
        rel: 'apple-touch-icon',
        href: `${import.meta.env.BASE_URL}apple-touch-icon.png`,
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: FONTS_HREF },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Scripts />
      </body>
    </html>
  )
}
