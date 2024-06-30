import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

import { GA_TRACKING_ID } from '../../config/config'

export const GoogleAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (GA_TRACKING_ID) {
      ReactGA.initialize([{ trackingId: GA_TRACKING_ID }])
    }
  }, [])

  useEffect(() => {
    if (GA_TRACKING_ID) {
      sendPageView(location.pathname)
    }
  }, [location.pathname])

  const sendPageView = (pathname: string) => {
    ReactGA.set({ page: pathname })
    ReactGA.send({ hitType: 'pageview', page: pathname })
  }

  return null
}
