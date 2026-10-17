import { HeroBanner } from 'oa-components';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import {
  data,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router';
import { TextInputField } from 'src/common/Form/TextInput.field';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { getSecret } from 'src/services/secretsService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { getReturnUrl } from 'src/utils/redirect.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ChevronLeft from '@/components/ui/icons/chevron-left.svg?react';
import { Label } from '@/components/ui/label';
import { TURNSTILE_TEST_SITE_KEY, Turnstile } from '@/components/ui/turnstile';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect(getReturnUrl(request), { headers });
  }

  const tenantSettings = await new TenantSettingsService(client).get();
  const turnstileSiteKey = await getSecret('TURNSTILE_SITE_KEY', TURNSTILE_TEST_SITE_KEY);

  return data({ ...tenantSettings, turnstileSiteKey }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const emailRedirectUrl = `${protocol}//${url.host}/update-password`;
  const captchaToken = formData.get('cf-turnstile-token') as string;

  await client.auth.resetPasswordForEmail(formData.get('email') as string, {
    redirectTo: emailRedirectUrl,
    captchaToken,
  });

  // Always return success and display a generic message, even when the user doesn't exist, for security reasons.
  return data({ success: true, email: formData.get('email') as string, error: null }, { headers });
};

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const title = `Reset Password - ${loaderData?.siteName}`;

  return generateTags(title);
});

export default function Index() {
  const { turnstileSiteKey } = useLoaderData<typeof loader>();
  const actionResponse = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ invalid }) => {
          return (
            <form data-cy="reset-password-form" method="post">
              <div className="mx-auto mt-10 mb-4 w-full max-w-124 px-2 md:mt-20">
                <HeroBanner type="celebration" />
                <Card variant="outline">
                  <CardHeader>
                    <h1 className="text-2xl font-semibold">Reset password</h1>
                    {!actionResponse?.success && (
                      <p className="text-sm text-muted-foreground">
                        <Link
                          to="/sign-in"
                          data-cy="no-account"
                          className="underline underline-offset-3 hover:no-underline"
                        >
                          Go back to Login
                        </Link>
                      </p>
                    )}
                  </CardHeader>
                  <CardContent gap="md" className="flex flex-col">
                    {actionResponse?.error && (
                      <div className="w-full rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {actionResponse.error}
                      </div>
                    )}

                    {actionResponse?.success ? (
                      <>
                        <p>
                          We've sent a message to{' '}
                          <span className="font-semibold">
                            {actionResponse.email || 'your email address'}
                          </span>
                          . If it's a registered account you will receive an email with
                          instructions.
                        </p>
                        <p>Please check your inbox (and spam folder).</p>
                        <Button
                          data-cy="go-back"
                          variant="outline"
                          className="w-fit"
                          type="button"
                          onClick={() => navigate('.')}
                        >
                          <ChevronLeft data-icon="inline-start" />
                          Go back to reset form
                        </Button>
                      </>
                    ) : (
                      <>
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

                        <Field name="cf-turnstile-token" validate={required}>
                          {({ input }) => (
                            <>
                              <Turnstile siteKey={turnstileSiteKey} onVerify={input.onChange} />
                              <input {...input} type="hidden" />
                            </>
                          )}
                        </Field>

                        <Button
                          data-cy="submit"
                          size="lg"
                          className="w-full justify-center"
                          disabled={isSubmitting || invalid}
                          type="submit"
                        >
                          Reset password
                        </Button>
                      </>
                    )}
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
