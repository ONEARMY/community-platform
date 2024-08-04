import { Global, ThemeProvider } from '@emotion/react'
import { Outlet } from '@remix-run/react'
import { GlobalStyles } from 'oa-components'
import { Alerts } from 'src/common/Alerts/Alerts'
import { Analytics } from 'src/common/Analytics'
import { ScrollToTop } from 'src/common/ScrollToTop'
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader'
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter'
import Header from 'src/pages/common/Header/Header'
import { StickyButton } from 'src/pages/common/StickyButton'
import { Flex } from 'theme-ui'

import { useCommonStores } from '../common/hooks/useCommonStores'

export async function clientLoader() {
  return null
}

export default function Index() {
  const rootStore = useCommonStores()

  return (
    <ThemeProvider theme={rootStore.stores.themeStore.currentTheme.styles}>
      <Flex
        sx={{ height: '100vh', flexDirection: 'column' }}
        data-cy="page-container"
      >
        <Analytics />
        <ScrollToTop />
        <DevSiteHeader />
        <Alerts />
        <Header />

        <Outlet />

        <GlobalSiteFooter />
        <StickyButton />
      </Flex>
      <Global styles={GlobalStyles} />
    </ThemeProvider>
  )
}
