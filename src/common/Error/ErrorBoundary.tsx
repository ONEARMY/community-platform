import * as Sentry from '@sentry/react'
import { Component } from 'react'
import type { ReactNode } from 'react'
import { SITE } from 'src/config/config'
import { ChunkLoadErrorHandler } from './handlers/ChunkLoadError'
import { isReloaded } from './handlers/Reloader'

interface IProps {
  children: ReactNode
}
interface IState {
  error?: Error
}

export default class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  /** When catching errors automatically report them to sentry if production */
  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error })
    if (SITE === 'production') {
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key])
        })
        // additionally track if the error has persisted after reload
        if (isReloaded()) {
          scope.setExtra('persistedAfterReload', true)
        }
        Sentry.captureException(error)
      })
    }
  }

  isChunkLoadError(error: Error) {
    return /loading chunk .+ failed/gi.test(error.message)
  }

  /**
   * Render error information component to users
   * When a chunkLoad error is detected render a specific handler which will also try to fix
   *
   * Otherwise default behaviour is to not render any specific UI and assume the error
   * was non-breaking so that the user can proceed as normal
   */
  render(): ReactNode {
    const { error } = this.state
    return error && this.isChunkLoadError(error) ? (
      <ChunkLoadErrorHandler />
    ) : (
      this.props.children
    )
  }
}
