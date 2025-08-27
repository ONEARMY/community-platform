import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json(
      {},
      { headers, status: 401, statusText: 'unauthorized' },
    )
  }

  const { data } = await client
    .from('subscribers')
    .select('id, profiles!inner(id)')
    .eq('content_id', params.contentId)
    .eq('content_type', params.contentType)
    .eq('profiles.auth_id', user.id)

  const subscribed = !!data && !(data.length === 0)

  return Response.json({ subscribed }, { headers, status: 200 })
}
