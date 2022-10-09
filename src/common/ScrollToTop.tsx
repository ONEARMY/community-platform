import * as React from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends React.Component<any, any> {
  public componentDidUpdate(prevProps: any) {
    // Check the location hash in case you are navigating in the page using hash ancor
    if (
      this.props.location !== prevProps.location &&
      this.props.location.hash === ''
    ) {
      window.scrollTo(0, 0)
    }
  }

  public render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
