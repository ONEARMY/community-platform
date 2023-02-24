import { withRouter } from 'react-router-dom'
import { GoogleAnalytics } from './GoogleAnalytics'
import ReactGA from 'react-ga4'
import type { UaEventOptions } from 'react-ga4/types/ga4'
import Plausible from 'plausible-tracker'

const { trackEvent: plausibleTrackEvent } = Plausible()

export const trackEvent = (options: UaEventOptions) => {
  ReactGA.event(options)
  plausibleTrackEvent(`${options.category} + ${options.action}`)
}

export const Analytics = withRouter(GoogleAnalytics)
