import { createSupabaseServerClient } from 'src/repository/supabase.server'

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
    .select('patreon')
    .eq('auth_id', user.id)
    .single()

  return Response.json(data?.patreon, { headers, status: 200 })
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

  await client
    .from('profiles')
    .update({ patreon: null, is_supporter: false })
    .eq('auth_id', user.id)

  return Response.json({}, { headers, status: 200 })
}
