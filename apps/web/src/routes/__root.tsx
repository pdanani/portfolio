import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { Aurora } from '#/components/backgrounds/aurora'
import { MotionProvider } from '#/lib/motion/motion-provider'
import { ThemeSwitcher } from '#/components/theme-switcher'
import { KitProvider } from '#/lib/kit-context'

import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pawan Danani — Software Engineer',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Apply the saved theme kit before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=localStorage.getItem('kit');if(k)document.documentElement.setAttribute('data-kit',k);}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <KitProvider>
          <Aurora />
          <MotionProvider>{children}</MotionProvider>
          <ThemeSwitcher />
        </KitProvider>
        <Scripts />
      </body>
    </html>
  )
}
