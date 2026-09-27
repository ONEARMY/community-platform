import { data, useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags } from 'src/utils/seo.utils';

export const meta = generateTags('Membership Terms of Use');

export async function loader({ request }) {
  const { client, headers } = createSupabaseServerClient(request);

  const tenantSettings = await new TenantSettingsService(client).get();

  return data({ membershipTerms: tenantSettings.membershipTerms }, { headers });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if (!data.membershipTerms) {
    return null;
  }

  return (
    <Main style={{ flex: 1 }}>
      <div
        className="prose max-w-none pt-8 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: data.membershipTerms }}
      />
    </Main>
  );
}
