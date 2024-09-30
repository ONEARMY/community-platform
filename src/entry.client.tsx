import { startTransition, useCallback, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import * as Sentry from '@sentry/remix'

import { SENTRY_CONFIG } from './config/config'
import { ClientStyleContext } from './styles/context'
import createEmotionCache from './styles/createEmotionCache'

Sentry.init({ ...SENTRY_CONFIG, autoInstrumentRemix: true })

const ClientCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(createEmotionCache())

  const reset = useCallback(() => setCache(createEmotionCache()), [])

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

startTransition(() => {
  hydrateRoot(
    document,
    <ClientCacheProvider>
      <RemixBrowser />
    </ClientCacheProvider>,
  )
})
