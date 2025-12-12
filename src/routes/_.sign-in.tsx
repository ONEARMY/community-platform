import { Field, Form } from 'react-final-form';
import { Link, redirect, useActionData } from 'react-router';
import { Button, FieldInput, HeroBanner, TextNotification } from 'oa-components';
import { PasswordField } from 'src/common/Form/PasswordField';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { getReturnUrl } from 'src/utils/redirect.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { Card, Flex, Heading, Label, Text } from 'theme-ui';

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect(getReturnUrl(request));
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error, data } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === 'email_not_confirmed') {
      const url = new URL(request.url);
      const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
      const emailRedirectUrl = `${protocol}//${url.host}/email-confirmation`;
      await client.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: emailRedirectUrl,
        },
      });

      return Response.json(
        {
          error: 'We need to confirm your email before logging in. Please check your inbox :)',
        },
        { headers },
      );
    }

    console.error(error);
    return Response.json(
      {
        error: 'Invalid email or password.',
      },
      { headers, status: 400 },
    );
  }

  const fallbackPath = data.user?.user_metadata.username
    ? `/u/${data.user?.user_metadata.username}`
    : '/';
  const path = getReturnUrl(request, fallbackPath);

  try {
    // This will fail if there is already a profile for the current auth_id, or the auth_id is invalid (can be invalid the the credentials are wrong)
    await new ProfileServiceServer(client).ensureProfile(data.user);
  } catch (error) {
    console.error(error);
  }

  return redirect(path, { headers });
};

export const meta = mergeMeta<typeof loader>(() => {
  const title = `Login - ${import.meta.env.VITE_SITE_NAME}`;

  return generateTags(title);
});

export default function Index() {
  const actionResponse: any = useActionData<typeof action>();

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting, invalid }) => {
          return (
            <form data-cy="login-form" method="post">
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
                  <HeroBanner type="celebration" />
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
                        <Heading>Log in</Heading>
                        <Text sx={{ fontSize: 1 }} color="grey">
                          <Link to="/sign-up" data-cy="no-account">
                            Don't have an account? Sign-up here
                          </Link>
                        </Text>
                      </Flex>

                      {actionResponse?.error && (
                        <TextNotification isVisible={true} variant={'failure'}>
                          <Text>{actionResponse?.error}</Text>
                        </TextNotification>
                      )}

                      <Flex sx={{ flexDirection: 'column' }}>
                        <Label htmlFor="title">Email</Label>
                        <Field
                          name="email"
                          type="email"
                          data-cy="email"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex sx={{ flexDirection: 'column' }}>
                        <Label htmlFor="title">Password</Label>
                        <PasswordField
                          name="password"
                          data-cy="password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex sx={{ justifyContent: 'space-between' }}>
                        <Text sx={{ fontSize: 1 }} color={'grey'}>
                          <Link to="/reset-password" data-cy="lost-password">
                            Forgotten password?
                          </Link>
                        </Text>
                      </Flex>

                      <Flex>
                        <Button
                          large
                          data-cy="submit"
                          sx={{
                            borderRadius: 3,
                            width: '100%',
                            justifyContent: 'center',
                          }}
                          variant="primary"
                          disabled={submitting || invalid}
                          type="submit"
                        >
                          Log in
                        </Button>
                      </Flex>
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
