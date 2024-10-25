import { json, Outlet, useLoaderData } from '@remix-run/react'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { Alerts } from 'src/common/Alerts/Alerts'
import { Analytics } from 'src/common/Analytics'
import { ScrollToTop } from 'src/common/ScrollToTop'
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader'
import {
  EnvironmentContext,
  getEnvVariables,
} from 'src/pages/common/EnvironmentContext'
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter'
import Header from 'src/pages/common/Header/Header'
import { StickyButton } from 'src/pages/common/StickyButton'
import { Flex } from 'theme-ui'

export async function loader() {
  const envVariables = getEnvVariables()

  return json(envVariables)
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

// This is a Layout file, it will render for all routes that have _. prefix.
export default function Index() {
  const envVariables = useLoaderData<typeof loader>()

  return (
    <EnvironmentContext.Provider value={envVariables}>
      <Flex
        sx={{ height: '100vh', flexDirection: 'column' }}
        data-cy="page-container"
      >
        <Analytics />
        <ScrollToTop />
        <ClientOnly fallback={<></>}>{() => <DevSiteHeader />}</ClientOnly>
        <Alerts />
        <Header />

        <Outlet />

        <GlobalSiteFooter />
        <ClientOnly fallback={<></>}>{() => <StickyButton />}</ClientOnly>
      </Flex>
    </EnvironmentContext.Provider>
  )
}
