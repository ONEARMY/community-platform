import { Component } from 'react'
import ReactGA from 'react-ga4'
import { GA_TRACKING_ID } from 'src/config/config'
import type { RouteComponentProps } from 'react-router-dom'

export class GoogleAnalytics extends Component<RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props)

    if (GA_TRACKING_ID) {
      ReactGA.initialize([{ trackingId: GA_TRACKING_ID }])
    }
  }

  componentDidMount() {
    if (GA_TRACKING_ID) {
      this.sendPageView(this.props.history.location)
      this.props.history.listen(this.sendPageView)
    }
  }

  sendPageView(location: any) {
    ReactGA.set({ page: location.pathname })
    ReactGA.send({ hitType: 'pageview', page: location.pathname })
  }

  render() {
    return null
  }
}
