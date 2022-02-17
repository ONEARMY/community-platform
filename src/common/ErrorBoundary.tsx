import * as Sentry from '@sentry/react'
import { Component } from 'react'

export default class ErrorBoundary extends Component<any, any> {
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
      // eslint-disable-next-line
      return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
    } else {
      // when there's not an error, render children untouched
      return this.props.children
    }
  }
}
