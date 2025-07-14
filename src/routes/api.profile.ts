import { Profile } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const nowUtc = new Date().toISOString()

  const { data } = await client
    .from('profiles')
    .update({ last_active: nowUtc })
    .eq('auth_id', user.id)
    .select('*')
    .single()

  const profile = Profile.fromDB(data)

  return Response.json(profile, { headers, status: 200 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  // TODO

  return Response.json({}, { headers, status: 200 })
}
