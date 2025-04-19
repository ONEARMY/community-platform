import { redirect } from '@remix-run/react'
import { UserRole } from 'oa-shared'
import { isPreciousPlastic } from 'src/config/config.server'
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { redirectServiceServer } from 'src/services/redirectService.server'

export async function loader({ request }) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn('/research/create', headers)
  }

  const profile = await profileServiceServer.getByAuthId(user.id, client)
  const roles = profile?.roles as string[]

  if (
    !isPreciousPlastic() &&
    !roles?.some((role) =>
      [UserRole.RESEARCH_CREATOR, UserRole.ADMIN].includes(role as UserRole),
    )
  ) {
    return redirect('/forbidden', { headers })
  }

  return Response.json({}, { headers })
}

export default function Index() {
  return <ResearchForm />
}
