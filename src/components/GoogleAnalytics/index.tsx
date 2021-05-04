import { Component } from 'react';
import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from 'src/config/config'
import { RouteComponentProps, withRouter } from 'react-router-dom'

class GoogleAnalytics extends Component<RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props)

    if (GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID, { debug: true })
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
    ReactGA.pageview(location.pathname)
  }

  render() {
    return null
  }
}

export default withRouter(GoogleAnalytics)
