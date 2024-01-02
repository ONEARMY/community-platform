import React from 'react'
import { observer, Provider } from 'mobx-react'
import { ThemeProvider, Global } from '@emotion/react'
import { GlobalStyles } from 'oa-components'
import { RootStore } from './stores'
import ErrorBoundary from './common/Error/ErrorBoundary'
import { Pages } from './pages'

const rootStore = new RootStore()

/**
 * Additional store and db exports for use in modern context consumers
 * @example const {userStore} = useCommonStores().stores
 */
export const rootStoreContext = React.createContext<RootStore>(rootStore)
export const useCommonStores = () =>
  React.useContext<RootStore>(rootStoreContext)
export const dbContext = React.createContext({ db: rootStore.dbV2 })
export const useDB = () => React.useContext(dbContext)

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
