import { Outlet, useLoaderData } from '@remix-run/react'
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
import { SessionContext } from 'src/pages/common/SessionContext'
import { StickyButton } from 'src/pages/common/StickyButton'
import { UserStoreWrapper } from 'src/pages/common/UserStoreWrapper'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { Flex } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBProfile } from 'src/models/profile.model'

export async function loader({ request }: LoaderFunctionArgs) {
  const environment = getEnvVariables()
  const { client } = createSupabaseServerClient(request)

  let profile: DBProfile | null = null
  const {
    data: { user },
  } = await client.auth.getUser()

  if (user) {
    profile = await profileServiceServer.getByAuthId(user.id, client)
  }

  return Response.json({ environment, profile })
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

// This is a Layout file, it will render for all routes that have _. prefix.
export default function Index() {
  const { environment, profile } = useLoaderData<typeof loader>()

  return (
    <EnvironmentContext.Provider value={environment}>
      <SessionContext.Provider value={profile}>
        <UserStoreWrapper>
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
        </UserStoreWrapper>
      </SessionContext.Provider>
    </EnvironmentContext.Provider>
  )
}
