import { css, Global } from '@emotion/react';
import { data, LoaderFunctionArgs } from 'react-router';
import Academy from 'src/pages/Academy/Academy';
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
  return generateTags(`Academy - ${loaderData?.siteName}`);
});

export default function Index() {
  return (
    <Main style={{ flex: 1, overflow: 'hidden' }} ignoreMaxWidth={true}>
      <Academy />
      <Global
        styles={css`
          html {
            overflow-y: hidden !important;
          }
        `}
      />
    </Main>
  );
}
