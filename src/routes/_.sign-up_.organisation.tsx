import { MemberBadge } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, Link, redirect, useActionData, useLoaderData } from 'react-router';
import { TextInputField } from 'src/common/Form/TextInput.field';
import Main from 'src/pages/common/Layout/Main';
import { ORGANISATION_SIGNUP_STEPS, organisationActivityClause } from 'src/pages/SignUp/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { bool, object, string } from 'yup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect('/', { headers });
  }

  const profileTypes = await new ProfileTypesServiceServer(client).get();
  const tenantSettings = await new TenantSettingsService(client).get();

  if (
    !tenantSettings.organisationSignupDescriptionHtml ||
    !profileTypes.some((type) => type.isSpace)
  ) {
    return redirect('/sign-up', { headers });
  }

  const spaceProfileTypes = profileTypes.filter((type) => type.isSpace);

  return data(
    {
      siteName: tenantSettings.siteName,
      descriptionHtml: tenantSettings.organisationSignupDescriptionHtml,
      activityClause: organisationActivityClause(tenantSettings.organisationActivity),
      spaceProfileTypes,
    },
    { headers },
  );
};

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const title = `Create an organisation account - ${loaderData?.siteName}`;

  return generateTags(title);
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const emailRedirectTo = `${protocol}//${url.host}/email-confirmation?flow=organisation`;

  const profileTypes = await new ProfileTypesServiceServer(client).get();
  const tenantSettings = await new TenantSettingsService(client).get();

  if (
    !tenantSettings.organisationSignupDescriptionHtml ||
    !profileTypes.some((type) => type.isSpace)
  ) {
    return data({ error: FRIENDLY_MESSAGES['generic-error'] }, { headers });
  }

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
    const response = await new OrganisationApplicationsServiceServer(client).create(
      signupResult.data.user.id,
    );

    // This will error if there is already an application for this auth_id + tenant_id
    if (response.error) {
      return data({ error: FRIENDLY_MESSAGES['generic-error'] }, { headers });
    }
  }

  return redirect(`/sign-up-message?email=${email}&flow=organisation`, {
    headers,
  });
};

export default function Index() {
  const { activityClause, descriptionHtml, spaceProfileTypes } = useLoaderData<typeof loader>();
  const actionResponse = useActionData<typeof action>();

  const validationSchema = object({
    email: string().email(FRIENDLY_MESSAGES['auth/invalid-email']).required('Required'),
    password: string()
      .min(6, FRIENDLY_MESSAGES['sign-up/password-short'])
      .required(FRIENDLY_MESSAGES['sign-up/password-required']),
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
                <div className="mx-auto flex w-full max-w-[548px] flex-col gap-6">
                  <div className="flex max-w-[508px] flex-col items-center gap-2 self-center text-center">
                    <div data-cy="organisation-signup-badges" className="flex justify-center">
                      {spaceProfileTypes.map((profileType, index) => (
                        <MemberBadge
                          key={profileType.name}
                          size={60}
                          profileType={profileType}
                          sx={{ marginLeft: index === 0 ? 0 : '-12px' }}
                        />
                      ))}
                    </div>
                    <h1 className="text-2xl font-semibold">Create an organisation account</h1>
                    <div
                      data-cy="organisation-signup-description"
                      className="prose max-w-none text-muted-foreground dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: descriptionHtml ?? '',
                      }}
                    />
                  </div>

                  <Card variant="outline">
                    <CardHeader className="gap-4">
                      <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={0} />
                      <h2 className="text-2xl font-semibold">Create an account</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {actionResponse?.error && pristine && (
                        <div
                          className="w-full rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive"
                          data-cy="TextNotification: failure"
                        >
                          {actionResponse.error}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Organisation's email</Label>
                        <p className="text-sm text-muted-foreground">
                          Email that the organisation uses.
                        </p>
                        <Field
                          id="email"
                          data-cy="email"
                          name="email"
                          type="email"
                          component={TextInputField}
                          placeholder="Email"
                          validate={required}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <p className="text-sm text-muted-foreground">
                          We recommend a strong password.
                        </p>
                        <Field
                          id="password"
                          data-cy="password"
                          name="password"
                          type="password"
                          component={TextInputField}
                          placeholder="Password"
                          validate={required}
                        />
                      </div>

                      <Alert className="gap-3 border-transparent bg-[#e2edf7]">
                        <AlertTitle>
                          Heads up. After this you need to fill in some information.
                        </AlertTitle>
                        <AlertDescription className="text-foreground">
                          A <strong className="font-bold">link to your website</strong> or social
                          media and <strong className="font-bold">pictures</strong> to verify{' '}
                          {activityClause}.
                        </AlertDescription>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-fit border-[#1b1b1b]"
                          render={
                            <Link
                              to="/academy"
                              data-cy="organisation-signup-learn-more"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          Learn more
                        </Button>
                      </Alert>

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
                                className="font-bold underline underline-offset-3 hover:no-underline"
                              >
                                Terms of Service
                              </a>{' '}
                              and{' '}
                              <a
                                href="/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline underline-offset-3 hover:no-underline"
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
                        Continue with the application form
                      </Button>
                    </CardContent>
                  </Card>

                  <p className="text-center text-sm text-muted-foreground">
                    Not an organisation?{' '}
                    <Link
                      to="/sign-up"
                      data-cy="sign-up-member"
                      className="underline underline-offset-3 hover:no-underline"
                    >
                      Sign-up as a member
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          );
        }}
      />
    </Main>
  );
}
