import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider, MobXProviderContext } from 'mobx-react'

import { ThemeProvider } from 'styled-components'
import styledTheme from 'src/themes/styled.theme'

import { Routes } from './pages'
import { RootStore } from './stores'
import { GlobalStyle } from './themes/app.globalStyle.js'

import registerServiceWorker from './registerServiceWorker'
import { SWUpdateNotification } from './pages/common/SWUpdateNotification/SWUpdateNotification'
import ErrorBoundary from './common/ErrorBoundary'
import { initErrorHandler } from './common/errors'

initErrorHandler()
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

ReactDOM.render(
  // provider makes all stores available through the app via @inject
  <Provider {...rootStore.stores}>
    <ThemeProvider theme={styledTheme}>
      <>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
        <SWUpdateNotification />
        <GlobalStyle />
      </>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

// callback function updates global store when service worker registered
const onUpdate = () => {
  console.log('sw updated receive in index')
  rootStore.stores.platformStore.setServiceWorkerStatus('updated')
}

registerServiceWorker(onUpdate)
