import React, { Component } from 'react'
import { observer, Provider } from 'mobx-react'
import { ThemeProvider } from '@emotion/react'
import { Global } from '@emotion/react'
import { GlobalStyle } from './themes/app.globalStyles'
import { RootStore } from './stores'
import ErrorBoundary from './common/ErrorBoundary'
import { Routes } from './pages'

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
              <Global styles={GlobalStyle} />
            </>
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}
