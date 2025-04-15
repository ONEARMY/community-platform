import { redirect } from '@remix-run/node'
import { UserRole } from 'oa-shared'
import { UserAction } from 'src/common/UserAction'
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm'
import { listing } from 'src/pages/News/labels'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'
import { Box } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn('/news/create', headers)
  }

  const { data } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', user.id)
    .single()

  if (!data?.roles?.includes(UserRole.ADMIN)) {
    return redirect('/forbidden', { headers })
  }

  return null
}

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box
          data-cy="incomplete-profile-message"
          sx={{
            alignSelf: 'center',
            paddingTop: 5,
          }}
        >
          {listing.incompleteProfile}
        </Box>
      }
      loggedIn={
        <NewsForm
          data-testid="news-create-form"
          parentType="create"
          news={null}
        />
      }
      loggedOut={<></>}
    />
  )
}
