import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { MotionProvider } from '#/lib/motion/motion-provider'

import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/* Only the three families the site uses; loaded as <link> (with preconnect)
   rather than a CSS @import so discovery isn't serialised behind the stylesheet. */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Space+Grotesk:wght@300..700&display=swap'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pawan Danani — Software Engineer' },
      {
        name: 'description',
        content:
          'Backend engineer building resilient distributed systems — Spring Boot, Postgres, Redis and Kafka.',
      },
    ],
    links: [
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
