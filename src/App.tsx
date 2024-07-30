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

  // To handle when hosting deletes the assets from previous deployments
  // https://vitejs.dev/guide/build#load-error-handling
  window.addEventListener('vite:preloadError', () => {
    window.location.reload()
  })

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
