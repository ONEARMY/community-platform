import React from 'react'
import ReactGA from 'react-ga'
import { SITE, GOOGLE_ANALYTICS_CONFIG } from 'src/config/config'
import { RouteComponentProps, withRouter } from 'react-router-dom'

class Analytics extends React.Component<RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props)

    if (SITE === 'production' && GOOGLE_ANALYTICS_CONFIG.trackingCode) {
      ReactGA.initialize(GOOGLE_ANALYTICS_CONFIG.trackingCode, { debug: true })
    }
  }

  componentDidMount() {
    if (SITE === 'production' && GOOGLE_ANALYTICS_CONFIG.trackingCode) {
      this.sendPageView(this.props.history.location)
      this.props.history.listen(this.sendPageView)
    }
  }

  sendPageView(location: any) {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  }

  render() {
    return null
  }
}

export default withRouter(Analytics)
