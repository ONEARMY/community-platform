import * as Sentry from '@sentry/browser'
import * as React from 'react'

export default class extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  render() {
    if (this.state.error) {
      // render fallback UI
      return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
    } else {
      // when there's not an error, render children untouched
      return this.props.children
    }
  }
}
