import { Global, ThemeProvider } from '@emotion/react'
import { observer } from 'mobx-react'
import { GlobalStyles } from 'oa-components'

import ErrorBoundary from './common/Error/ErrorBoundary'
import {
  rootStoreContext,
  useCommonStores,
} from './common/hooks/useCommonStores'
import { Pages } from './pages'

export const App = observer(() => {
  const rootStore = useCommonStores()

  return (
    <rootStoreContext.Provider value={rootStore}>
      <ThemeProvider theme={rootStore.stores.themeStore.currentTheme.styles}>
        <>
          <ErrorBoundary>
            <Pages />
          </ErrorBoundary>
          <Global styles={GlobalStyles} />
        </>
      </ThemeProvider>
    </rootStoreContext.Provider>
  )
})
