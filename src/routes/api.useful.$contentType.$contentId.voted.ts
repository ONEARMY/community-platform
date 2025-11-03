import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 })
  }

  const useful = await client
    .from('useful_votes')
    .select('id, profiles!inner(id)', { count: 'exact' })
    .eq('content_id', params.contentId)
    .eq('content_type', params.contentType)
    .eq('profiles.auth_id', claims.data.claims.sub)

  const voted = useful.count === 1

  return Response.json({ voted }, { headers, status: 200 })
}
