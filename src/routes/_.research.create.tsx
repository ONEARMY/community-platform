import { redirect } from 'react-router'
import { UserRole } from 'oa-shared'
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { redirectServiceServer } from 'src/services/redirectService.server'

export async function loader({ request }) {
  const { client, headers } = createSupabaseServerClient(request)

  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/research/create', headers)
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.getByAuthId(claims.data.claims.sub)
  const roles = (profile?.roles || []) as string[]

  // Check if user has required permissions
  const isAdmin = roles?.includes(UserRole.ADMIN) ?? false
  const isResearchCreator = roles?.includes(UserRole.RESEARCH_CREATOR) ?? false
  const canCreate = isAdmin || isResearchCreator

  if (!canCreate) {
    return redirect('/forbidden?page=research-create', { headers })
  }

  return Response.json({}, { headers })
}

export default function Index() {
  return <ResearchForm />
}
