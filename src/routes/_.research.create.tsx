import { redirect } from '@remix-run/react'
import { UserRole } from 'oa-shared'
import { isPreciousPlastic } from 'src/config/config.server'
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

export async function loader({ request }) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirect('/research')
  }
  const profileResult = await client
    .from('profiles')
    .select('roles')
    .eq('auth_id', user.id)
    .limit(1)

  const roles = profileResult.data?.at(0)?.roles as string[]

  if (
    !isPreciousPlastic() &&
    !roles?.some((role) =>
      [UserRole.RESEARCH_CREATOR, UserRole.ADMIN].includes(role as UserRole),
    )
  ) {
    return redirect('/research')
  }

  return Response.json({}, { headers })
}

export default function Index() {
  return <ResearchForm />
}
