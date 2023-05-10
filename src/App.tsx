import { Global } from '@emotion/react'
import { observer, Provider } from 'mobx-react'
import { GlobalStyles } from 'oa-components'
import React, { Component } from 'react'
import { ThemeProvider } from 'theme-ui'
import ErrorBoundary from './common/Error/ErrorBoundary'
import { Routes } from './pages'
import { RootStore } from './stores'

const rootStore = new RootStore()

/**
 * Additional store and db exports for use in modern context consumers
 * @example const {userStore} = useCommonStores()
 */
export const rootStoreContext = React.createContext<RootStore>(rootStore)
export const useCommonStores = () =>
  React.useContext<RootStore>(rootStoreContext)
export const dbContext = React.createContext({ db: rootStore.dbV2 })
export const useDB = () => React.useContext(dbContext)

@observer
export class App extends Component {
  render() {
    return (
      <>
        <Provider {...rootStore.stores}>
          <ThemeProvider
            theme={rootStore.stores.themeStore.currentTheme.styles}
          >
            <>
              <ErrorBoundary>
                <Routes />
              </ErrorBoundary>
              <Global styles={GlobalStyles} />
            </>
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}
