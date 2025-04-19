import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { status: 401, statusText: 'unauthorized' })
  }

  const useful = await client
    .from('useful_votes')
    .select('id, profiles!inner(id)', { count: 'exact' })
    .eq('content_id', params.contentId)
    .eq('content_type', params.contentType)
    .eq('profiles.auth_id', user.id)

  const voted = useful.count === 1

  return Response.json({ voted }, { headers, status: 200 })
}
