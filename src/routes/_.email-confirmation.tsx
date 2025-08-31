import { useEffect } from 'react'
import { Form } from 'react-final-form'
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { Button, HeroBanner } from 'oa-components'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { fireConfetti } from 'src/utils/fireConfetti'
import { Card, Flex, Heading, Text } from 'theme-ui'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const error = url.searchParams.get('error_description')
  const token = url.searchParams.get('token')

  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (user) {
    return redirect('/settings', { headers })
  }

  if (error) {
    return Response.json({ error }, { headers })
  }

  if (token) {
    return Response.json({ token }, { headers })
  }

  return redirect('/')
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const url = new URL(request.url)

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
    type: 'signup',
  })

  if (!tokenVerification.data.user) {
    return Response.json(
      { error: 'Your link has expired or is invalid' },
      { status: 400, headers },
    )
  }

  return Response.json({ success: true }, { headers })
}

export default function Index() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  useEffect(() => {
    if (actionData?.success) {
      fireConfetti()
      navigate('/settings')
    }
  }, [actionData?.success])

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting }) => {
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
                        <Heading>Email confirmation</Heading>
                      </Flex>

                      {data.error ? (
                        <Text color="red">{data?.error}</Text>
                      ) : (
                        <>
                          {actionData?.error && (
                            <Text color="red">{actionData?.error}</Text>
                          )}

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
                              disabled={submitting}
                              type="submit"
                            >
                              Confirm Email
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
