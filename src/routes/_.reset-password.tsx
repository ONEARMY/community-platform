import { Field, Form } from 'react-final-form'
import { redirect } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import { Button, FieldInput, HeroBanner } from 'oa-components'
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

  const url = new URL(request.url)
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:'
  const emailRedirectUrl = `${protocol}//${url.host}/update-password`

  await client.auth.resetPasswordForEmail(formData.get('email') as string, {
    redirectTo: emailRedirectUrl,
  })

  // Always return success and display a generic message, even when the user doesn't exist, for security reasons.
  return Response.json({ success: true }, { headers })
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
                        <Heading>Reset Password</Heading>
                        <Text sx={{ fontSize: 1 }} color="grey">
                          <Link to="/sign-in" data-cy="no-account">
                            Go back to Login
                          </Link>
                        </Text>
                      </Flex>

                      {actionResponse?.error && (
                        <Text color="red">{actionResponse?.error}</Text>
                      )}

                      {actionResponse?.success ? (
                        <Text color="green">
                          Please check your inbox (and your spam folder) for
                          further instructions.
                        </Text>
                      ) : (
                        <>
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
                              Reset password
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
