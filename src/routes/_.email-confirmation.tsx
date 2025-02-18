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
    console.error(error)
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  if (user) {
    return redirect('/', { headers })
  }

  const code = url.searchParams.get('code')

  if (code) {
    const result = await client.auth.exchangeCodeForSession(
      url.searchParams.get('code') as string,
    )

    if (!result.error) {
      return redirect('/', { headers })
    }

    console.error(error)
  }

  return redirect('/sign-in', { headers })
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
          <Flex mt={3} sx={{ justifyContent: 'flex-start' }}></Flex>
        </Flex>
      </Flex>
    </Main>
  )
}
