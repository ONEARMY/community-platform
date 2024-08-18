import { useContext, useEffect } from 'react'
import { Global, ThemeProvider, withEmotionCache } from '@emotion/react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { GlobalStyles } from 'oa-components'
import {
  fixingFashionTheme,
  preciousPlasticTheme,
  projectKampTheme,
} from 'oa-themes'

import { ClientStyleContext, ServerStyleContext } from './styles/context'

interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)
    const resetClientStyleData = clientStyleData?.reset

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData?.reset()
    }, [])

    // Only executed on client
    useEffect(() => {
      if (resetClientStyleData) {
        resetClientStyleData()
      }
    }, [resetClientStyleData])

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="preconnect"
            href="https://storage.googleapis.com"
            crossOrigin="anonymous"
          />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
)

const getEnvironmentTheme = () => {
  switch (import.meta.env.VITE_THEME) {
    case 'project-kamp':
      return projectKampTheme
    case 'fixing-fashion':
      return fixingFashionTheme
    case 'precious-plastic':
    default:
      return preciousPlasticTheme
  }
}

export default function Root() {
  return (
    <Document>
      <ThemeProvider theme={getEnvironmentTheme().styles}>
        <Outlet />
        <Global styles={GlobalStyles} />
      </ThemeProvider>
    </Document>
  )
}
