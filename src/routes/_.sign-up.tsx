/* eslint-disable unicorn/filename-case */
import { Field, Form } from 'react-final-form'
import { Link, redirect, useActionData } from '@remix-run/react'
import { Button, ExternalLink, FieldInput, HeroBanner } from 'oa-components'
import { FRIENDLY_MESSAGES } from 'oa-shared'
import { PasswordField } from 'src/common/Form/PasswordField'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { authServiceServer } from 'src/services/authService.server'
import { userService } from 'src/services/userService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import {
  composeValidators,
  noSpecialCharacters,
  required,
} from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'
import { bool, object, ref, string } from 'yup'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request)
  const { data } = await client.auth.getUser()

  if (data.user) {
    return redirect('/')
  }

  return null
}

export const meta = mergeMeta<typeof loader>(() => {
  const title = `Sign Up - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title)
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()
  const url = new URL(request.url)
  const emailRedirectUrl = url.protocol + '//' + url.host + '/update-password'

  const username = formData.get('username') as string

  if (!(await authServiceServer.isUsernameAvailable(username, client))) {
    return Response.json(
      { error: 'That username is already taken!' },
      { headers },
    )
  }

  const { data, error } = await client.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: { username },
      emailRedirectTo: emailRedirectUrl,
    },
  })

  if (error) {
    if (error.code === 'weak_password') {
      return Response.json({ error: error.message }, { headers })
    }

    return Response.json({ error: 'Oops, something went wrong!' }, { headers })
  }

  if (data.user) {
    await authServiceServer.createUserProfile(
      { user: data.user, username },
      client,
    )

    await userService.createFirebaseProfile(data.user)
  }

  return redirect('/sign-up-message', { headers })
}

const rowWidth = ['100%', '100%', `100%`]

export default function Index() {
  const actionResponse = useActionData<typeof action>()

  const validationSchema = object({
    username: string()
      .min(2, 'Username must be at least 2 characters')
      .required('Required'),
    email: string()
      .email(FRIENDLY_MESSAGES['auth/invalid-email'])
      .required('Required'),
    password: string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    'confirm-password': string()
      .oneOf([ref('password'), ''], 'Your new password does not match')
      .required('Password confirm is required'),
    consent: bool().oneOf([true], 'Consent is required'),
  })

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        validate={async (values: any) => {
          try {
            await validationSchema.validate(values, { abortEarly: false })
          } catch (err) {
            return err.inner.reduce(
              (acc: any, error) => ({
                ...acc,
                [error.path]: error.message,
              }),
              {},
            )
          }
        }}
        render={({ submitting, invalid, pristine }) => {
          const disabled = invalid || submitting
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
                        <Heading>Create an account</Heading>
                        <Text color={'grey'} sx={{ fontSize: 1 }}>
                          <Link
                            to="/sign-in"
                            style={{
                              textDecoration: 'underline',
                            }}
                          >
                            Already have an account? Sign-in here
                          </Link>
                        </Text>
                      </Flex>

                      {actionResponse?.error && pristine && (
                        <Text color="red">{actionResponse?.error}</Text>
                      )}

                      <Flex
                        sx={{
                          width: rowWidth,
                          flexDirection: 'column',
                        }}
                      >
                        <Label htmlFor="username">Username</Label>
                        <Field
                          data-cy="username"
                          name="username"
                          type="userName"
                          placeholder="yourusername"
                          component={FieldInput}
                          validate={composeValidators(
                            required,
                            noSpecialCharacters,
                          )}
                        />
                      </Flex>
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          width: rowWidth,
                        }}
                      >
                        <Label htmlFor="email">Email</Label>
                        <Text color={'grey'} sx={{ fontSize: 1 }}>
                          It can be personal or work email.
                        </Text>
                        <Field
                          data-cy="email"
                          name="email"
                          type="email"
                          component={FieldInput}
                          placeholder="yourname@domain.com"
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
                        <PasswordField
                          data-cy="password"
                          name="password"
                          placeholder="Password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          width: rowWidth,
                        }}
                      >
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <PasswordField
                          data-cy="confirm-password"
                          name="confirm-password"
                          placeholder="Confirm your Password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
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
                            <ExternalLink href="/terms">
                              Terms of Service
                            </ExternalLink>
                            <span> and </span>
                            <ExternalLink href="/privacy">
                              Privacy Policy
                            </ExternalLink>
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
                          Create account
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
            </form>
          )
        }}
      />
    </Main>
  )
}
