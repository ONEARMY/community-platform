import * as Sentry from '@sentry/browser'
import { SENTRY_CONFIG } from '../config/config'

export const log = {
  message: Sentry.captureMessage,
  event: Sentry.captureEvent,
  exception: Sentry.captureException,
}
export const Level = Sentry.Severity
export const initErrorHandler = () => {
  if (location.search.indexOf('noSentry=true') !== -1) {
    return
  }
  // please check https://docs.sentry.io/error-reporting/configuration/?platform=javascript for options
  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
  })
}
