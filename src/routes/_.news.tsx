import { data, LoaderFunctionArgs, Outlet } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const title = `News - ${loaderData?.siteName}`;

  return generateTags(title);
});

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  );
}
