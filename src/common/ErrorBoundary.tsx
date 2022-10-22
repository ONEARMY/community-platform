import * as Sentry from '@sentry/react'
import { Component } from 'react'
import type { ReactNode } from 'react'
import { SITE } from 'src/config/config'

interface IProps {
  children: ReactNode
}

export default class ErrorBoundary extends Component<any, any> {
  constructor(props: IProps) {
    super(props)
    this.state = { error: null }
  }

  /** When catching errors automatically report them to sentry if production */
  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error })
    if (SITE === 'production') {
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key])
        })
        Sentry.captureException(error)
      })
    }
  }

  /**
   * By default we still just render the content as intended. We could include
   * fallback screen or redirect but instead expect the error not severe enough
   * to break (or that our popup will be able to help all that much...)
   */
  render(): ReactNode {
    return this.props.children
  }
}
