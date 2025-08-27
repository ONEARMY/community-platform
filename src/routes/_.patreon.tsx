import { redirect } from '@remix-run/node'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { patreonServiceServer } from 'src/services/patreonService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { Flex, Text } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const patreonCode = url.searchParams.get('code')

  const { client, headers } = createSupabaseServerClient(request)

  if (!patreonCode) {
    return Response.json(
      { error: 'No code provided' },
      { status: 400, headers },
    )
  }

  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) {
      return redirect('/sign-in', { headers })
    }

    const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:'
    const origin = `${protocol}//${url.host}`

    await patreonServiceServer.verifyAndUpdatePatreonUser(
      patreonCode,
      user,
      client,
      origin,
    )

    return redirect('/settings/account', { headers })
  } catch (error) {
    console.error('Error verifying patreon code', error)
  }

  return null
}

export const meta = mergeMeta<typeof loader>(() => {
  return generateTags('Patreon')
})

export default function Index() {
  return (
    <Main>
      <Flex
        sx={{
          flexDirection: 'column',
          maxWidth: '400px',
          textAlign: 'center',
          mx: 'auto',
          mt: 15,
        }}
      >
        <Text>
          Sorry, we encountered an error integrating your Patreon account.
          Please try again later!
        </Text>
      </Flex>
    </Main>
  )
}
