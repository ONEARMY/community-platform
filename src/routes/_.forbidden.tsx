import { Button, ExternalLink } from 'oa-components';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { Card, Flex, Heading, Text } from 'theme-ui';
import { getTenantSettings } from './api.messages';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settings = await getTenantSettings(client);

  const url = new URL(request.url);
  const pageMatch = url.search.match(/[?&]page=([^&]*)/);
  const page = pageMatch ? decodeURIComponent(pageMatch[1]) : null;

  return { page, settings, url };
}

export default function Index() {
  const { page, settings, url } = useLoaderData<typeof loader>() || {};

  const actionLabel = page ? 'I want to use it' : 'Report the problem';

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
                  <Heading>Oh no you can't post, yet</Heading>
                </Flex>
                <Text sx={{ textAlign: 'center', color: 'grey' }}>
                  {page ? (
                    <>
                      <p>
                        <strong>
                          This is a new feature and we are currently rolling it out to a small group
                          of people.
                        </strong>
                      </p>
                      <p>
                        Let us know if you have a project to share and want to be an early tester.
                        We'd love to set you up.
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>
                        You don't have the right permissions to go here right now. If this is wrong,
                        please let us know.
                      </strong>
                    </p>
                  )}
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
