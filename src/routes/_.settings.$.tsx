import { data, type LoaderFunctionArgs, redirect } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client';
import { SETTINGS_TABS } from 'src/pages/UserSettings/settingsTabs';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
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

  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

  if (!profile) {
    const hasApplication = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
      claims.data.claims.sub,
    );

    if (hasApplication) {
      return redirect('/organisation-application', { headers });
    }
  }

  const url = new URL(request.url);
  if (incompletePathname(url.pathname)) {
    return redirect('/settings/profile', { headers });
  }

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData, location }) => {
  const siteName = loaderData?.siteName ?? 'Community Platform';
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const tab = SETTINGS_TABS.find((t) => t.route === normalizedPath);
  const page = tab ? tab.title : 'Profile';

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
