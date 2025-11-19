import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router'
import { GA_TRACKING_ID } from 'src/config/config'

declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, any>) => void
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation()

  // TODO: remove GA
  useEffect(() => {
    if (GA_TRACKING_ID) {
      ReactGA.initialize([{ trackingId: GA_TRACKING_ID }])
    }
  }, [])

  useEffect(() => {
    if (GA_TRACKING_ID) {
      sendPageView(location)
    }
  }, [location])

  useEffect(() => {
    if (window.plausible) {
      window.plausible('pageview')
    }
  }, [location.pathname, location.search])

  const sendPageView = (location: any) => {
    ReactGA.set({ page: location.pathname })
    ReactGA.send({ hitType: 'pageview', page: location.pathname })
  }

  return null
}
