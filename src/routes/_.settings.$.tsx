import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/settings/profile', headers);
  }

  const url = new URL(request.url);
  if (url.pathname === '/settings' || url.pathname === '/settings/') {
    return redirect('/settings/profile', { headers });
  }

  return new Response(null, { headers });
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>{() => <SettingsPage />}</ClientOnly>
    </Main>
  );
}
