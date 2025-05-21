/* eslint-disable unicorn/filename-case */
import { LibraryForm } from 'src/pages/Library/Content/Common/Library.form'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'

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
  return <LibraryForm />
}
