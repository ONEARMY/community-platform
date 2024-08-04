import * as Sentry from '@sentry/react'

import { SENTRY_CONFIG } from '../../config/config'
import { logger } from '../../logger'

export const initErrorHandler = () => {
  const { location } = window
  if (
    location.search.indexOf('noSentry=true') !== -1 ||
    location.hostname === 'localhost'
  ) {
    logger.info('No error handler for this environment')
    return
  }

  // To handle when hosting deletes the assets from previous deployments
  // https://vitejs.dev/guide/build#load-error-handling
  window.addEventListener('vite:preloadError', () => {
    window.location.reload()
  })

  // please check https://docs.sentry.io/error-reporting/configuration/?platform=javascript for options
  Sentry.init(SENTRY_CONFIG)
}
