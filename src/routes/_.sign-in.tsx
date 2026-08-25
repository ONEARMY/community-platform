import { HeroBanner } from 'oa-components';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, Link, redirect, useActionData } from 'react-router';
import { TextInputField } from 'src/common/Form/TextInput.field';
import { logger } from 'src/logger';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { getReturnUrl } from 'src/utils/redirect.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect(getReturnUrl(request), { headers });
  }

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const signInResult = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (signInResult.error) {
    if (signInResult.error.code === 'email_not_confirmed') {
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

      return data(
        {
          error: 'We need to confirm your email before logging in. Please check your inbox :)',
          email,
        },
        { headers },
      );
    }

    logger.error(signInResult.error);
    return data(
      {
        error: 'Invalid email or password.',
        email,
      },
      { headers, status: 400 },
    );
  }

  const profileService = new ProfileServiceServer(client);

  try {
    // This will fail if there is already a profile for the current auth_id, or the auth_id is invalid (can be invalid the the credentials are wrong)
    await profileService.ensureProfile(signInResult.data.user);
  } catch (error) {
    logger.error(error);
  }

  const profile = await profileService.getByAuthId(signInResult.data.user.id);

  const fallbackPath = profile?.username ? `/u/${profile.username}` : '/';
  const path = getReturnUrl(request, fallbackPath);

  return redirect(path, { headers });
};

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const title = `Sign In - ${loaderData?.siteName}`;

  return generateTags(title);
});

export default function Index() {
  const actionResponse = useActionData<typeof action>();

  return (
    <Main style={{ flex: 1 }}>
      <Form
        initialValues={{ email: actionResponse?.email }}
        onSubmit={() => {}}
        render={({ submitting, invalid }) => {
          return (
            <form data-cy="login-form" method="post">
              <div className="mx-auto mt-10 mb-4 w-full max-w-[620px] px-2 md:mt-20">
                <HeroBanner type="celebration" />
                <Card variant="outline">
                  <CardHeader>
                    <h1 className="text-2xl font-semibold">Log in</h1>
                    <p className="text-sm text-muted-foreground">
                      <Link to="/sign-up" data-cy="no-account" className="hover:underline">
                        Don't have an account? Sign-up here
                      </Link>
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {actionResponse?.error && (
                      <div
                        className="w-full rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        data-cy="TextNotification: failure"
                      >
                        {actionResponse.error}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        data-cy="email"
                        component={TextInputField}
                        validate={required}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        data-cy="password"
                        component={TextInputField}
                        validate={required}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Link
                        to="/reset-password"
                        data-cy="lost-password"
                        className="hover:underline"
                      >
                        Forgotten password?
                      </Link>
                    </p>

                    <Button
                      data-cy="submit"
                      size="lg"
                      className="w-full justify-center"
                      disabled={submitting || invalid}
                      type="submit"
                    >
                      Log in
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          );
        }}
      />
    </Main>
  );
}
