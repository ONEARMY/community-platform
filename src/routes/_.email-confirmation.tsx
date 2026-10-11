import { Button, FieldInput, HeroBanner } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, redirect, useActionData, useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { ORGANISATION_SIGNUP_STEPS } from 'src/pages/SignUp/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { AuthServiceServer } from 'src/services/authService.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { getSecret } from 'src/services/secretsService.server';
import { getEmailConfirmationUrl } from 'src/utils/redirect.server';
import { required } from 'src/utils/validators';
import { Card, Flex, Heading, Label, Text } from 'theme-ui';
import { Stepper } from '@/components/ui/stepper';
import { TURNSTILE_TEST_SITE_KEY, Turnstile } from '@/components/ui/turnstile';

type EmailConfirmationActionData = {
  error?: string;
  canResend?: boolean;
  resent?: boolean;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const error = url.searchParams.get('error_description');
  const token = url.searchParams.get('token');
  const isOrganisation = url.searchParams.get('flow') === 'organisation';

  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

    if (!profile) {
      const hasApplication = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
        claims.data.claims.sub,
      );

      if (hasApplication) {
        return redirect('/organisation-application', { headers });
      }
    }

    return redirect('/settings/profile', { headers });
  }

  if (token || error) {
    const turnstileSiteKey = await getSecret('TURNSTILE_SITE_KEY', TURNSTILE_TEST_SITE_KEY);

    return data({ token, error, isOrganisation, turnstileSiteKey }, { headers });
  }

  return redirect('/', { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const formData = await request.formData();

  if (formData.get('intent') === 'resend') {
    const resendError = await new AuthServiceServer(client).resendConfirmationEmail({
      email: formData.get('email') as string,
      emailRedirectTo: getEmailConfirmationUrl(
        request,
        url.searchParams.get('flow') === 'organisation',
      ),
      captchaToken: formData.get('cf-turnstile-token') as string,
    });

    if (resendError) {
      return data<EmailConfirmationActionData>(
        { error: resendError, canResend: true },
        { status: 400, headers },
      );
    }

    return data<EmailConfirmationActionData>({ resent: true }, { headers });
  }

  // Get the token from URL params (it should still be there)
  const token = url.searchParams.get('token');

  if (!token) {
    return data<EmailConfirmationActionData>(
      { error: 'Your reset link is invalid' },
      { status: 400, headers },
    );
  }

  const tokenVerification = await client.auth.verifyOtp({
    token_hash: token,
    type: 'signup',
  });

  if (!tokenVerification.data.user) {
    return data<EmailConfirmationActionData>(
      { error: 'Your link has expired or is invalid', canResend: true },
      { status: 400, headers },
    );
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(
    tokenVerification.data.user.id,
  );

  if (!profile) {
    const hasApplication = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
      tokenVerification.data.user.id,
    );

    if (hasApplication) {
      return redirect('/organisation-application', { headers });
    }
  }

  return redirect('/setup-email-preferences', { headers });
};

const ResendLinkForm = ({
  turnstileSiteKey,
  disabled,
}: {
  turnstileSiteKey: string;
  disabled: boolean;
}) => (
  <Flex sx={{ flexDirection: 'column', gap: 3 }}>
    <Text>Enter your email address and we'll send you a new confirmation link.</Text>
    <Flex sx={{ flexDirection: 'column' }}>
      <Label htmlFor="email">Email</Label>
      <Field
        id="email"
        name="email"
        type="email"
        data-cy="email"
        component={FieldInput}
        validate={required}
      />
    </Flex>

    <Field name="cf-turnstile-token" validate={required}>
      {({ input }) => (
        <>
          <Turnstile siteKey={turnstileSiteKey} onVerify={input.onChange} />
          <input {...input} type="hidden" />
        </>
      )}
    </Field>

    <Button
      large
      data-cy="resend"
      sx={{ borderRadius: 3, width: '100%', justifyContent: 'center' }}
      variant="primary"
      disabled={disabled}
      type="submit"
      name="intent"
      value="resend"
    >
      Send me a new link
    </Button>
  </Flex>
);

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting, invalid }) => {
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
                      {loaderData.isOrganisation && (
                        <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={1} />
                      )}
                      <Flex sx={{ gap: 2, flexDirection: 'column' }}>
                        <Heading>Email confirmation</Heading>
                      </Flex>

                      {loaderData.error ? (
                        <Text color="red">{loaderData?.error}</Text>
                      ) : actionData?.resent ? (
                        <Text data-cy="resend-success">
                          {FRIENDLY_MESSAGES['auth/confirmation-link-requested']}
                        </Text>
                      ) : (
                        <>
                          {actionData?.error && <Text color="red">{actionData?.error}</Text>}

                          {actionData?.canResend ? (
                            <ResendLinkForm
                              turnstileSiteKey={loaderData.turnstileSiteKey}
                              disabled={submitting || invalid}
                            />
                          ) : (
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
                                {loaderData.isOrganisation
                                  ? 'Continue with the application form'
                                  : 'Confirm Email'}
                              </Button>
                            </Flex>
                          )}
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
