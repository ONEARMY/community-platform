import { Field, Form } from 'react-final-form'
import { redirect } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import { Button, FieldInput, HeroBanner } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { getReturnUrl } from 'src/utils/redirect.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { required } from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request)
  const { data } = await client.auth.getUser()

  if (data.user) {
    return redirect(getReturnUrl(request))
  }

  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()

  const { error } = await client.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return Response.json(
      { error: 'Invalid username or password.' },
      { headers },
    )
  }

  return redirect(getReturnUrl(request), { headers })
}

export const meta = mergeMeta<typeof loader>(() => {
  const title = `Login - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title)
})

export default function Index() {
  const actionResponse = useActionData<typeof action>()

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
                          <Link
                            to={
                              '/sign-up?returnUrl=' +
                              encodeURIComponent(location.pathname)
                            }
                            data-cy="no-account"
                          >
                            Don't have an account? Sign-up here
                          </Link>
                        </Text>
                      </Flex>

                      {actionResponse?.error && (
                        <Text color="red">{actionResponse?.error}</Text>
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
          )
        }}
      />
    </Main>
  )
}
