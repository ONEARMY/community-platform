import { data, LoaderFunctionArgs } from 'react-router';
import ResearchList from 'src/pages/Research/Content/ResearchList';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  return generateTags(`Research - ${loaderData?.siteName}`);
});

export default function Index() {
  return <ResearchList />;
}
