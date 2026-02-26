import { useContext } from 'react';
import { data, LoaderFunctionArgs, Outlet } from 'react-router';
import { isModuleSupported, MODULE } from 'src/modules';
import Main from 'src/pages/common/Layout/Main';
import { TenantContext } from 'src/pages/common/TenantContext';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  return generateTags(`Questions - ${loaderData?.siteName}`);
});

export default function Index() {
  const tenantContext = useContext(TenantContext);

  if (!isModuleSupported(tenantContext?.supportedModules || '', MODULE.QUESTIONS)) {
    return null;
  }

  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  );
}
