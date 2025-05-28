import { Link, redirect } from '@remix-run/react'
import { Button, HeroBanner } from 'oa-components'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { Card, Flex, Heading, Text } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const url = new URL(request.url)

  const error = url.searchParams.get('error_description')
  if (error) {
    console.error('Email confirmation error:', error)
    return redirect('/sign-in?error=email-confirmation-failed', { headers })
  }

  // Check if user is already authenticated
  const {
    data: { user },
  } = await client.auth.getUser()

  if (user) {
    // User is already logged in, redirect to profile completion
    return redirect('/settings', { headers })
  }

  const code = url.searchParams.get('code')
  if (!code) {
    // No code provided, redirect to sign in
    return redirect('/sign-in', { headers })
  }

  // Exchange code for session to log the user in
  const result = await client.auth.exchangeCodeForSession(code)

  if (result.error) {
    console.error('Email confirmation exchange error:', result.error)
    return redirect('/sign-in?error=email-confirmation-expired', { headers })
  }

  // Successfully confirmed and logged in - show success page
  return Response.json({}, { headers })
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
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
            <Flex sx={{ padding: 4, gap: 4, flexDirection: 'column' }}>
              <Flex sx={{ gap: 2, flexDirection: 'column' }}>
                <Heading>Your email is confirmed!</Heading>
                <Heading variant="small">Nice one</Heading>
              </Flex>

              <Text sx={{ color: 'grey' }}>
                Before contributing, we'd love it if you could let everyone know
                who you are.
              </Text>

              <Flex sx={{ gap: 2 }}>
                <Link to="/settings" data-cy="complete-profile-button">
                  <Button
                    type="button"
                    variant="primary"
                    sx={{ borderRadius: 3 }}
                  >
                    Complete your profile
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Main>
  )
}
