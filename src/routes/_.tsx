import { Outlet } from '@remix-run/react'
import { Alerts } from 'src/common/Alerts/Alerts'
import { Analytics } from 'src/common/Analytics'
import { ScrollToTop } from 'src/common/ScrollToTop'
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter'
import Header from 'src/pages/common/Header/Header'
import { StickyButton } from 'src/pages/common/StickyButton'
import { Flex } from 'theme-ui'

export async function loader() {
  return null
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once pages are using SSR.
  return <div></div>
}

// This is a Layout file, it will render for all routes that have _. prefix.
export default function Index() {
  return (
    <Flex
      sx={{ height: '100vh', flexDirection: 'column' }}
      data-cy="page-container"
    >
      <Analytics />
      <ScrollToTop />
      {/* <DevSiteHeader /> */}
      <Alerts />
      <Header />

      <Outlet />

      <GlobalSiteFooter />
      <StickyButton />
    </Flex>
  )
}
