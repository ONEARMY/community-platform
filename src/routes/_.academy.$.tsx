import { css, Global } from '@emotion/react';
import { data, LoaderFunctionArgs } from 'react-router';
import Academy from 'src/pages/Academy/Academy';
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  MOBILE_NAV_HEIGHT,
} from 'src/pages/common/Header/navLayout';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { Box } from 'theme-ui';

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
      <Box
        sx={{
          height: [
            `calc(100dvh - ${HEADER_HEIGHT_MOBILE + MOBILE_NAV_HEIGHT}px)`,
            `calc(100dvh - ${HEADER_HEIGHT_MOBILE + MOBILE_NAV_HEIGHT}px)`,
            `calc(100dvh - ${HEADER_HEIGHT_DESKTOP}px)`,
          ],
        }}
      >
        <Academy />
      </Box>
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
