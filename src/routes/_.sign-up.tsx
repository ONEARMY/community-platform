import { HeroBanner } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, Link, redirect, useActionData } from 'react-router';
import { TextInputField } from 'src/common/Form/TextInput.field';
import Main from 'src/pages/common/Layout/Main';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { AuthServiceServer } from 'src/services/authService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { bool, object, ref, string } from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect('/', { headers });
  }
  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
};

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const title = `Sign Up - ${loaderData?.siteName}`;

  return generateTags(title);
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const emailRedirectTo = `${protocol}//${url.host}/email-confirmation`;

  const authServiceServer = new AuthServiceServer(client);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const signupResult = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (signupResult.error) {
    if (signupResult.error.code === 'weak_password') {
      return data({ error: FRIENDLY_MESSAGES['password-weak'] }, { headers });
    }

    return data({ error: FRIENDLY_MESSAGES['generic-error'] }, { headers });
  }

  if (signupResult.data.user) {
    const response = await authServiceServer.createUserProfile({ user: signupResult.data.user });

    // This will error if there is already a profile with this auth_id + tenant_id
    if (response.error) {
      return data({ error: FRIENDLY_MESSAGES['generic-error'] }, { headers });
    }
  }

  return redirect(`/sign-up-message?email=${email}`, { headers });
};

export default function Index() {
  const actionResponse = useActionData<typeof action>();

  const validationSchema = object({
    email: string().email(FRIENDLY_MESSAGES['auth/invalid-email']).required('Required'),
    password: string()
      .min(6, FRIENDLY_MESSAGES['sign-up/password-short'])
      .required(FRIENDLY_MESSAGES['sign-up/password-required']),
    'confirm-password': string()
      .oneOf([ref('password'), ''], FRIENDLY_MESSAGES['sign-up/password-mismatch'])
      .required(FRIENDLY_MESSAGES['sign-up/email-required']),
    consent: bool().oneOf([true], FRIENDLY_MESSAGES['sign-up/terms']),
  });

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        validate={async (values: any) => {
          try {
            await validationSchema.validate(values, { abortEarly: false });
          } catch (err) {
            return err.inner.reduce(
              (acc: any, error) => ({
                ...acc,
                [error.path]: error.message,
              }),
              {},
            );
          }
        }}
        render={({ submitting, invalid, pristine }) => {
          const disabled = invalid || submitting;
          return (
            <form method="post">
              <div className="mx-auto mt-10 mb-4 w-full max-w-[620px] px-2 md:mt-20">
                <HeroBanner type="celebration" />
                <Card variant="outline">
                  <CardHeader>
                    <h1 className="text-2xl font-semibold">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                      <Link to="/sign-in" className="hover:underline">
                        Already have an account? Sign-in here
                      </Link>
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {actionResponse?.error && pristine && (
                      <div
                        className="w-full rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        data-cy="TextNotification: failure"
                      >
                        {actionResponse.error}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email</Label>
                      <p className="text-sm text-muted-foreground">
                        It can be personal or work email.
                      </p>
                      <Field
                        id="email"
                        data-cy="email"
                        name="email"
                        type="email"
                        component={TextInputField}
                        placeholder="yourname@domain.com"
                        validate={required}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Field
                        id="password"
                        data-cy="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        component={TextInputField}
                        validate={required}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Field
                        id="confirm-password"
                        data-cy="confirm-password"
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm your Password"
                        component={TextInputField}
                        validate={required}
                      />
                    </div>
                    <Field name="consent" type="checkbox" validate={required}>
                      {({ input }) => (
                        <Label htmlFor="consent" className="items-start gap-2 font-normal">
                          <Checkbox
                            id="consent"
                            data-cy="consent"
                            checked={input.checked}
                            onCheckedChange={input.onChange}
                            onBlur={input.onBlur}
                          />
                          <span className="text-sm">
                            I agree to the{' '}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline-offset-4 hover:underline"
                            >
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline-offset-4 hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </Label>
                      )}
                    </Field>

                    <Button
                      data-cy="submit"
                      size="lg"
                      className="w-full justify-center"
                      disabled={disabled}
                      type="submit"
                    >
                      Create account
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
