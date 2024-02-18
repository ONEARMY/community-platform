import React from 'react'
import { Global, ThemeProvider } from '@emotion/react'
import { observer, Provider } from 'mobx-react'
import { GlobalStyles } from 'oa-components'

import ErrorBoundary from './common/Error/ErrorBoundary'
import { RootStore } from './stores/RootStore'
import { Pages } from './pages'

const rootStore = new RootStore()

export const App = observer(() => {
  return (
    <Provider {...rootStore.stores}>
      <ThemeProvider theme={rootStore.stores.themeStore.currentTheme.styles}>
        <>
          <ErrorBoundary>
            <Pages />
          </ErrorBoundary>
          <Global styles={GlobalStyles} />
        </>
      </ThemeProvider>
    </Provider>
  )
})
