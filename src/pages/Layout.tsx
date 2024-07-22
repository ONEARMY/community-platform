import { Global, ThemeProvider } from '@emotion/react'
import { GlobalStyles } from 'oa-components'
import { Analytics } from 'src/common/Analytics'
import { ScrollToTop } from 'src/common/ScrollToTop'
import { Flex } from 'theme-ui'

import { useCommonStores } from '../common/hooks/useCommonStores'
import { StickyButton } from './common/StickyButton'

import type { ReactNode } from 'react'

const Layout = (props: { children: ReactNode | ReactNode[] }) => {
  const rootStore = useCommonStores()

  return (
    <ThemeProvider theme={rootStore.stores.themeStore.currentTheme.styles}>
      <Flex
        sx={{ height: '100vh', flexDirection: 'column' }}
        data-cy="page-container"
      >
        <Analytics />
        <ScrollToTop />
        {props.children}

        <StickyButton />
      </Flex>
      <Global styles={GlobalStyles} />
    </ThemeProvider>
  )
}

export { Layout }
