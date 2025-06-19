import { ClientOnly } from 'remix-utils/client-only'
import { UserAction } from 'src/common/UserAction'
import { LibraryForm } from 'src/pages/Library/Content/Common/Library.form'
import { listing } from 'src/pages/Library/labels'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'
import { Box } from 'theme-ui'

export async function loader({ request }) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn('/library/create', headers)
  }

  return Response.json({}, { headers })
}

export default function Index() {
  return (
    <ClientOnly>
      {() => (
        <UserAction
          incompleteProfile={
            <Box
              data-cy="incomplete-profile-message"
              sx={{ alignSelf: 'center', paddingTop: 5 }}
            >
              {listing.incompleteProfile}
            </Box>
          }
          loggedIn={<LibraryForm />}
          loggedOut={<></>}
        />
      )}
    </ClientOnly>
  )
}
