import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const userProfile = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .limit(1)
  const profileId = userProfile.data?.at(0)?.id

  if (!profileId) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'invalid user' },
    )
  }

  const { count } = await client
    .from('research')
    .select('id', { count: 'exact' })
    .eq('is_draft', true)
    .eq('created_by', profileId)

  return Response.json({ total: count }, { headers })
}
