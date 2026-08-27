import { data, type LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

const incompletePathname = (pathname) => {
  const incompletePathnameList = ['/settings', '/settings/', '/settings.data'];
  if (incompletePathnameList.includes(pathname)) {
    return true;
  }
  return false;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/settings/profile', headers);
  }

  const url = new URL(request.url);
  if (incompletePathname(url.pathname)) {
    return redirect('/settings/profile', { headers });
  }

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

const SETTINGS_PAGE_TITLES: Record<string, string> = {
  profile: 'Profile',
  map: 'Map',
  impact: 'Impact',
  notifications: 'Notifications',
  account: 'Account',
};

export const meta = mergeMeta<typeof loader>(({ loaderData, location }) => {
  const siteName = loaderData?.siteName ?? 'Community Platform';
  const subPath = location.pathname.replace(/^\/settings\/?/, '').split('/')[0];
  const page = SETTINGS_PAGE_TITLES[subPath] ?? 'Profile';

  const title = `${page} - Settings - ${siteName}`;
  return generateTags(title);
});

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>{() => <SettingsPage />}</ClientOnly>
    </Main>
  );
}
