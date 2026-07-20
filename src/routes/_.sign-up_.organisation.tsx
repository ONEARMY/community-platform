import {
  Button,
  ExternalLink,
  FieldInput,
  MemberBadge,
  Stepper,
  TextNotification,
} from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { Field, Form } from 'react-final-form';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, Link, redirect, useActionData, useLoaderData } from 'react-router';
import { PasswordField } from 'src/common/Form/PasswordField';
import Main from 'src/pages/common/Layout/Main';
import { ORGANISATION_SIGNUP_STEPS } from 'src/pages/SignUp/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { OrganisationSignupSettingsServiceServer } from 'src/services/organisationSignupSettingsService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { required } from 'src/utils/validators';
import { Alert, Card, Flex, Heading, Image, Label, Text } from 'theme-ui';
import { bool, object, string } from 'yup';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect('/', { headers });
  }

  const profileTypes = await new ProfileTypesServiceServer(client).get();
  const organisationSignupSettings = await new OrganisationSignupSettingsServiceServer(
    client,
  ).get();

  if (!organisationSignupSettings || !profileTypes.some((type) => type.isSpace)) {
    return redirect('/sign-up', { headers });
  }

  const tenantSettings = await new TenantSettingsService(client).get();
  const spaceProfileTypes = profileTypes.filter((type) => type.isSpace);

  return data(
    { siteName: tenantSettings.siteName, organisationSignupSettings, spaceProfileTypes },
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
  const organisationSignupSettings = await new OrganisationSignupSettingsServiceServer(
    client,
  ).get();

  if (!organisationSignupSettings || !profileTypes.some((type) => type.isSpace)) {
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

const rowWidth = ['100%', '100%', `100%`];

export default function Index() {
  const { organisationSignupSettings, spaceProfileTypes } = useLoaderData<typeof loader>();
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
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: '100%', maxWidth: '620px' }}
                mx="auto"
                mt={[5, 10]}
                mb={3}
              >
                <Flex sx={{ flexDirection: 'column', width: '100%', gap: 3 }}>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      gap: 2,
                      textAlign: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {organisationSignupSettings.imageUrl ? (
                      <Image
                        src={organisationSignupSettings.imageUrl}
                        alt=""
                        data-cy="organisation-signup-image"
                        sx={{ maxWidth: '200px', maxHeight: '120px' }}
                      />
                    ) : (
                      <Flex
                        data-cy="organisation-signup-badges"
                        sx={{ gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}
                      >
                        {spaceProfileTypes.map((profileType) => (
                          <MemberBadge key={profileType.name} size={60} profileType={profileType} />
                        ))}
                      </Flex>
                    )}
                    <Heading>Create an organisation account</Heading>
                    <Text
                      color="grey"
                      data-cy="organisation-signup-description"
                      sx={{ fontSize: 2 }}
                      dangerouslySetInnerHTML={{
                        __html: organisationSignupSettings.descriptionHtml,
                      }}
                    />
                  </Flex>
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
                      <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={0} />

                      <Heading>Create an account</Heading>

                      {actionResponse?.error && pristine && (
                        <TextNotification variant="failure" isVisible>
                          {actionResponse?.error}
                        </TextNotification>
                      )}

                      <Flex
                        sx={{
                          flexDirection: 'column',
                          width: rowWidth,
                        }}
                      >
                        <Label htmlFor="email">Organisation's email</Label>
                        <Text color="grey" sx={{ fontSize: 1 }}>
                          Email that the organisation uses.
                        </Text>
                        <Field
                          data-cy="email"
                          name="email"
                          type="email"
                          component={FieldInput}
                          placeholder="Email"
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          width: rowWidth,
                        }}
                      >
                        <Label htmlFor="password">Password</Label>
                        <Text color="grey" sx={{ fontSize: 1 }}>
                          We recommend a strong password.
                        </Text>
                        <PasswordField
                          data-cy="password"
                          name="password"
                          placeholder="Password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>

                      <Alert variant="info" sx={{ textAlign: 'left', fontWeight: 'normal' }}>
                        <Text sx={{ fontSize: 1 }}>
                          Heads up. After this you need to fill in some information: a{' '}
                          <strong>link to your website</strong> or social media and{' '}
                          <strong>pictures</strong> to verify your organisation.
                        </Text>
                      </Alert>

                      <Flex>
                        <Label
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Field
                            data-cy="consent"
                            name="consent"
                            type="checkbox"
                            component="input"
                            validate={required}
                          />
                          <Text
                            sx={{
                              fontSize: 2,
                            }}
                          >
                            I agree to the{' '}
                            <ExternalLink href="/terms">Terms of Service</ExternalLink>
                            <span> and </span>
                            <ExternalLink href="/privacy">Privacy Policy</ExternalLink>
                          </Text>
                        </Label>
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
                          disabled={disabled}
                          type="submit"
                        >
                          Continue with the application form
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                  <Text color="grey" sx={{ fontSize: 1, textAlign: 'center' }}>
                    Not an organisation?{' '}
                    <Link
                      to="/sign-up"
                      data-cy="sign-up-member"
                      style={{ textDecoration: 'underline' }}
                    >
                      Sign-up as a member
                    </Link>
                  </Text>
                </Flex>
              </Flex>
            </form>
          );
        }}
      />
    </Main>
  );
}
