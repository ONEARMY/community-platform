import { Button, ExternalLink } from 'oa-components';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { getForbiddenMessage } from 'src/pages/Forbidden/labels';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { Card, Flex, Heading, Text } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settings = await new TenantSettingsService(client).get();

  const url = new URL(request.url);
  const pageMatch = url.search.match(/[?&]page=([^&]*)/);
  const page = pageMatch ? decodeURIComponent(pageMatch[1]) : null;

  return { page, settings, url };
}

export default function Index() {
  const { page, settings, url } = useLoaderData<typeof loader>() || {};

  const { heading, body, actionLabel } = getForbiddenMessage(page);

  return (
    <Main style={{ flex: 1 }}>
      <Flex
        sx={{
          background: 'inherit',
          paddingX: 2,
          width: '100%',
          maxWidth: '620px',
          marginX: 'auto',
          marginTop: [5, 10],
        }}
      >
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Flex
            sx={{
              flexDirection: 'column',
            }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <Flex
                sx={{
                  padding: 4,
                  paddingTop: 6,
                  gap: 2,
                  flexDirection: 'column',
                }}
              >
                <Flex
                  sx={{
                    gap: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Heading>{heading}</Heading>
                </Flex>
                <Text sx={{ textAlign: 'center', color: 'grey' }}>
                  <p>
                    <strong>{body}</strong>
                  </p>
                  <ExternalLink
                    href={`mailto:${settings.emailFrom}&subject:Cannot access ${page || url}`}
                  >
                    <Button>{actionLabel}</Button>
                  </ExternalLink>
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Main>
  );
}
