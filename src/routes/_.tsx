import type { LoaderFunctionArgs } from 'react-router';
import { data, Outlet, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { Alerts } from 'src/common/Alerts/Alerts';
import { Analytics } from 'src/common/Analytics';
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter';
import Header from 'src/pages/common/Header/Header';
import { SessionContext } from 'src/pages/common/SessionContext';
import { StickyButton } from 'src/pages/common/StickyButton';
import {
  getEnvVariables,
  TenantContext,
  TenantSettingsContext,
} from 'src/pages/common/TenantContext';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { SubscriptionStoreProvider } from 'src/stores/Subscription/subscription.store';
import { UsefulVoteStoreProvider } from 'src/stores/UsefulVote/usefulVote.store';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { Flex } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const environment = getEnvVariables();
  const settings = await new TenantSettingsService(client).get();

  const tenantSettings: TenantSettingsContext = {
    ...settings,
    environment,
  };

  const claims = await client.auth.getClaims();

  return data({ tenantSettings, claims: claims.data?.claims || null }, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  return generateTags(
    loaderData?.tenantSettings.siteName || 'Community Platform',
    loaderData?.tenantSettings.siteDescription,
  );
});

// This is a Layout file, it will render for all routes that have _. prefix.
export default function Index() {
  const { tenantSettings, claims } = useLoaderData<typeof loader>();

  return (
    <TenantContext.Provider value={tenantSettings}>
      <SessionContext.Provider value={claims}>
        <ProfileStoreProvider>
          <SubscriptionStoreProvider>
            <UsefulVoteStoreProvider>
              <Flex sx={{ height: '100vh', flexDirection: 'column' }} data-cy="page-container">
                <Analytics />
                <Header />
                <Alerts />

                <Outlet />

                <GlobalSiteFooter />
                <ClientOnly fallback={<></>}>{() => <StickyButton />}</ClientOnly>
              </Flex>
            </UsefulVoteStoreProvider>
          </SubscriptionStoreProvider>
        </ProfileStoreProvider>
      </SessionContext.Provider>
    </TenantContext.Provider>
  );
}
