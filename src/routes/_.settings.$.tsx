import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/settings', headers);
  }

  return null;
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>{() => <SettingsPage />}</ClientOnly>
    </Main>
  );
}
