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
  console.log({
    VITE_ACADEMY_RESOURCE: import.meta.env.VITE_ACADEMY_RESOURCE,
    VITE_PROFILE_GUIDELINES_URL: import.meta.env.VITE_PROFILE_GUIDELINES_URL,
    VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME,
    VITE_THEME: import.meta.env.VITE_THEME,
    VITE_DONATIONS_BODY: import.meta.env.VITE_DONATIONS_BODY,
    VITE_DONATIONS_IFRAME_SRC: import.meta.env.VITE_DONATIONS_IFRAME_SRC,
    VITE_DONATIONS_IMAGE_URL: import.meta.env.VITE_DONATIONS_IMAGE_URL,
    VITE_HOWTOS_HEADING: import.meta.env.VITE_HOWTOS_HEADING,
    VITE_COMMUNITY_PROGRAM_URL: import.meta.env.VITE_COMMUNITY_PROGRAM_URL,
    VITE_QUESTIONS_GUIDELINES_URL: import.meta.env
      .VITE_QUESTIONS_GUIDELINES_URL,
    VITE_BRANCH: import.meta.env.VITE_BRANCH,
    VITE_CDN_URL: import.meta.env.VITE_CDN_URL,
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_DATABASE_URL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
      .VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,
    VITE_PATREON_CLIENT_ID: import.meta.env.VITE_PATREON_CLIENT_ID,
    VITE_PLATFORM_THEME: import.meta.env.VITE_PLATFORM_THEME,
    VITE_PROJECT_VERSION: import.meta.env.VITE_PROJECT_VERSION,
    VITE_SUPPORTED_MODULES: import.meta.env.VITE_SUPPORTED_MODULES,
  })
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
