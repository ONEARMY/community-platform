import { useEffect } from 'react'
import { Form } from 'react-final-form'
import {
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { Button, FieldInput, HeroBanner } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { required } from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const error = url.searchParams.get('error_description')
  const token = url.searchParams.get('token')

  const { client, headers } = createSupabaseServerClient(request)

  if (error) {
    return Response.json({ error }, { headers })
  }

  if (token) {
    return Response.json({ token }, { headers })
  }

  const claims = await client.auth.getClaims()

  if (claims.data?.claims) {
    return Response.json({}, { headers })
  }

  return redirect('/')
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const url = new URL(request.url)

  const formData = await request.formData()
  const password = formData.get('password') as string
  const passwordRepeat = formData.get('passwordRepeat') as string

  if (password !== passwordRepeat) {
    return Response.json(
      { error: 'Passwords do not match' },
      { status: 400, headers },
    )
  }

  // Get the token from URL params (it should still be there)
  const token = url.searchParams.get('token')

  if (!token) {
    return Response.json(
      { error: 'Your reset link is invalid' },
      { status: 400, headers },
    )
  }

  const tokenVerification = await client.auth.verifyOtp({
    token_hash: token,
    type: 'recovery',
  })

  if (!tokenVerification.data.user) {
    return Response.json(
      { error: 'Your reset link has expired or is invalid' },
      { status: 400, headers },
    )
  }

  // Now update the password
  const result = await client.auth.updateUser({ password })

  if (result.error) {
    return Response.json(
      { error: result.error.message },
      { status: 500, headers },
    )
  }

  // Redirect with the session headers to automatically log in the user
  return redirect('/', { headers })
}

export default function Index() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  useEffect(() => {
    if (actionData?.success) {
      navigate('/')
    }
  }, [actionData?.success])

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting, invalid }) => {
          return (
            <form data-cy="reset-password-form" method="post">
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
                        <Heading>Update Password</Heading>
                        <Text sx={{ fontSize: 1 }} color="grey">
                          <Link to="/sign-in" data-cy="no-account">
                            Go back to Login
                          </Link>
                        </Text>
                      </Flex>

                      {data.error ? (
                        <Text color="red">{data?.error}</Text>
                      ) : (
                        <>
                          {actionData?.error && (
                            <Text color="red">{actionData?.error}</Text>
                          )}

                          <Flex sx={{ flexDirection: 'column' }}>
                            <Label htmlFor="password">Your new password</Label>
                            <PasswordField
                              name="password"
                              type="password"
                              data-cy="password"
                              component={FieldInput}
                              validate={required}
                            />
                          </Flex>

                          <Flex sx={{ flexDirection: 'column' }}>
                            <Label htmlFor="passwordRepeat">
                              Repeat your new password
                            </Label>
                            <PasswordField
                              name="passwordRepeat"
                              type="password"
                              data-cy="passwordRepeat"
                              component={FieldInput}
                              validate={required}
                            />
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
                              Update password
                            </Button>
                          </Flex>
                        </>
                      )}
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
