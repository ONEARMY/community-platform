import { createSupabaseServerClient } from 'src/repository/supabase.server'

import { patreonServiceServer } from '../services/patreonService.server'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const { data } = await client
    .from('profiles')
    .select('patreon,is_supporter')
    .eq('auth_id', user.id)
    .single()

  return Response.json(
    { isSupporter: data?.is_supporter, patreon: data?.patreon },
    { headers, status: 200 },
  )
}

export const action = async ({ request }) => {
  if (request.method !== 'DELETE') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  try {
    await patreonServiceServer.disconnectUser(user, client);

    return Response.json({}, { headers, status: 200 })
  } catch (err) {
    return Response.json({}, { headers, status: 500 })
  }
}
