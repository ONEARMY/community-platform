import { LoaderFunctionArgs, redirect } from 'react-router';
import { getSupportedModules, MODULE } from 'src/modules';
import { getAvailablePageList } from 'src/pages/PageList';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const { supportedModules, hiddenModules } = await new TenantSettingsService(client).get();

  const isNewsPublic = getAvailablePageList(
    getSupportedModules(supportedModules),
    hiddenModules,
  ).some((page) => page.module === MODULE.NEWS);

  return redirect(isNewsPublic ? '/news' : '/academy', { headers });
}

export default function Index() {
  return null;
}
