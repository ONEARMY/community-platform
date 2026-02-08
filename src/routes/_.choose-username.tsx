/* eslint-disable unicorn/filename-case */
import { Field, Form } from 'react-final-form';
import { redirect, useActionData, useLoaderData } from 'react-router';
import { Button, FieldInput, HeroBanner, TextNotification } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { authServiceServer } from 'src/services/authService.server';
import { getReturnUrl } from 'src/utils/redirect.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { composeValidators, noSpecialCharacters, required } from 'src/utils/validators';
import { Card, Flex, Heading, Label, Text } from 'theme-ui';
import { object, string } from 'yup';

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims?.sub) {
    return redirect('/sign-in');
  }

  const authId = claims.data.claims.sub;

  const existingProfile = await authServiceServer.getProfileByAuthId(authId, client);
  if (existingProfile?.username) {
    return redirect(getReturnUrl(request, `/u/${existingProfile.username}`));
  }

  const adminClient = createSupabaseAdminServerClient();
  const { data: otherTenantProfile } = await adminClient
    .from('profiles')
    .select('username')
    .eq('auth_id', authId)
    .limit(1)
    .single();

  const suggestedUsername = otherTenantProfile?.username ?? '';

  return {
    suggestedUsername,
    hasExistingUsername: !!suggestedUsername,
  };
};

export const meta = mergeMeta<typeof loader>(() => {
  const title = `Choose Username - ${import.meta.env.VITE_SITE_NAME}`;
  return generateTags(title);
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const claims = await client.auth.getClaims();
  if (!claims.data?.claims?.sub) {
    return redirect('/sign-in');
  }

  const authId = claims.data.claims.sub;
  const username = formData.get('username') as string;

  if (!(await authServiceServer.isUsernameAvailable(username, client))) {
    return Response.json(
      { error: FRIENDLY_MESSAGES['sign-up/username-taken'], username },
      { headers },
    );
  }

  const { data: profileTypes } = await client
    .from('profile_types')
    .select('id')
    .eq('is_space', false)
    .limit(1);

  const { error } = await client.from('profiles').insert({
    auth_id: authId,
    username: username,
    display_name: username,
    tenant_id: process.env.TENANT_ID,
    profile_type: profileTypes?.at(0)?.id ?? null,
  });

  if (error) {
    console.error('Error creating profile:', error);
    return Response.json({ error: FRIENDLY_MESSAGES['generic-error'] }, { headers });
  }

  return redirect(getReturnUrl(request, `/u/${username}`), { headers });
};

export default function Index() {
  const { suggestedUsername, hasExistingUsername } = useLoaderData<typeof loader>();
  const actionResponse: any = useActionData<typeof action>();

  const validationSchema = object({
    username: string().min(2, FRIENDLY_MESSAGES['sign-up/username-short']).required('Required'),
  });

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        initialValues={{ username: actionResponse?.username ?? suggestedUsername }}
        validate={async (values: any) => {
          try {
            await validationSchema.validate(values, { abortEarly: false });
          } catch (err) {
            return err.inner.reduce(
              (acc: any, error: any) => ({
                ...acc,
                [error.path]: error.message,
              }),
              {},
            );
          }
        }}
        render={({ submitting, invalid }) => {
          return (
            <form method="post">
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: '100%' }}
                css={{ maxWidth: '620px' }}
                mx={'auto'}
                mt={[5, 10]}
                mb={3}
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
                      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                        <Heading>Choose your username</Heading>
                        <Text color="grey" sx={{ fontSize: 1 }}>
                          Pick a username for this community
                        </Text>
                      </Flex>

                      {hasExistingUsername && (
                        <TextNotification variant="success" isVisible>
                          We found your username from another community. Feel free to use it here or
                          pick a different one!
                        </TextNotification>
                      )}

                      {actionResponse?.error && (
                        <TextNotification variant="failure" isVisible>
                          {actionResponse?.error}
                        </TextNotification>
                      )}

                      <Flex sx={{ flexDirection: 'column' }}>
                        <Label htmlFor="username">Username</Label>
                        <Field
                          name="username"
                          type="text"
                          data-cy="username"
                          component={FieldInput}
                          validate={composeValidators(required, noSpecialCharacters)}
                        />
                      </Flex>

                      <Flex>
                        <Button
                          large
                          sx={{
                            borderRadius: 3,
                            width: '100%',
                            justifyContent: 'center',
                          }}
                          data-cy="submit"
                          variant="primary"
                          disabled={submitting || invalid}
                          type="submit"
                        >
                          Continue
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
