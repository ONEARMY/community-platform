import { Button, HeroBanner } from 'oa-components';
import { Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, redirect, useActionData, useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { Card, Flex, Heading, Text } from 'theme-ui';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const error = url.searchParams.get('error_description');
  const token = url.searchParams.get('token');

  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect('/settings/profile', { headers });
  }

  if (token || error) {
    return data({ token, error }, { headers });
  }

  return redirect('/', { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);

  // Get the token from URL params (it should still be there)
  const token = url.searchParams.get('token');

  if (!token) {
    return data({ error: 'Your reset link is invalid' }, { status: 400, headers });
  }

  const tokenVerification = await client.auth.verifyOtp({
    token_hash: token,
    type: 'signup',
  });

  if (!tokenVerification.data.user) {
    return data({ error: 'Your link has expired or is invalid' }, { status: 400, headers });
  }

  return redirect('/setup-email-preferences', { headers });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting }) => {
          return (
            <form data-cy="email-confirmation-form" method="post">
              <Flex
                sx={{
                  bg: 'inherit',
                  px: 2,
                  width: '100%',
                  maxWidth: '620px',
                  mx: 'auto',
                  mt: [5, 10],
                  mb: 3,
                }}
              >
                <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                  <HeroBanner type="email" />
                  <Card sx={{ borderRadius: 3 }}>
                    <Flex
                      sx={{
                        flexWrap: 'wrap',
                        flexDirection: 'column',
                        padding: 4,
                        gap: 4,
                        width: '100%',
                      }}
                    >
                      <Flex sx={{ gap: 2, flexDirection: 'column' }}>
                        <Heading>Email confirmation</Heading>
                      </Flex>

                      {loaderData.error ? (
                        <Text color="red">{loaderData?.error}</Text>
                      ) : (
                        <>
                          {actionData?.error && <Text color="red">{actionData?.error}</Text>}

                          <Flex
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: '2rem',
                            }}
                          >
                            <Button
                              large
                              data-cy="submit"
                              sx={{
                                borderRadius: 3,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                              variant="primary"
                              disabled={submitting}
                              type="submit"
                            >
                              Confirm Email
                            </Button>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
            </form>
          );
        }}
      />
    </Main>
  );
}
