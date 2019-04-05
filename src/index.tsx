import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import { ThemeProvider } from 'styled-components'
import styledTheme from 'src/themes/styled.theme'

import { Routes } from './pages'
import { stores } from './stores'
import { GlobalStyle } from './themes/app.globalStyle.js'

import registerServiceWorker from './registerServiceWorker'
import { SWUpdateNotification } from './pages/common/SWUpdateNotification/SWUpdateNotification'
import ErrorBoundary from './common/ErrorBoundary'
import { initErrorHandler } from './common/errors'
initErrorHandler()
ReactDOM.render(
  // provider makes all stores available through the app via @inject
  <Provider {...stores}>
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
  stores.platformStore.setServiceWorkerStatus('updated')
}

registerServiceWorker(onUpdate)
