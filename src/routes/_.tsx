import { Outlet, useLoaderData } from 'react-router';
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only';
import { Alerts } from 'src/common/Alerts/Alerts';
import { Analytics } from 'src/common/Analytics';
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader';
import { EnvironmentContext, getEnvVariables } from 'src/pages/common/EnvironmentContext';
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter';
import Header from 'src/pages/common/Header/Header';
import { SessionContext } from 'src/pages/common/SessionContext';
import { StickyButton } from 'src/pages/common/StickyButton';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { Flex } from 'theme-ui';

import type { JwtPayload } from '@supabase/supabase-js';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const environment = getEnvVariables();
  const { client, headers } = createSupabaseServerClient(request);

  const { data } = await client.auth.getClaims();

  const claims: JwtPayload | undefined = data?.claims;

  return Response.json({ environment, claims }, { headers });
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>;
}

// This is a Layout file, it will render for all routes that have _. prefix.
export default function Index() {
  const { environment, claims } = useLoaderData<typeof loader>();

  return (
    <EnvironmentContext.Provider value={environment}>
      <SessionContext.Provider value={claims}>
        <ProfileStoreProvider>
          <Flex sx={{ height: '100vh', flexDirection: 'column' }} data-cy="page-container">
            <Analytics />
            <ClientOnly fallback={<></>}>{() => <DevSiteHeader />}</ClientOnly>
            <Header />
            <Alerts />

            <Outlet />

            <GlobalSiteFooter />
            <ClientOnly fallback={<></>}>{() => <StickyButton />}</ClientOnly>
          </Flex>
        </ProfileStoreProvider>
      </SessionContext.Provider>
    </EnvironmentContext.Provider>
  );
}
