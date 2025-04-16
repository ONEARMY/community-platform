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

  // Note: must be a better way of doing this?
  const profile = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  const { data } = await client
    .from('notifications')
    .select('*')
    .eq('owned_by_id', profile?.data?.id)

  return Response.json({ notifications: data }, { headers, status: 200 })
}
