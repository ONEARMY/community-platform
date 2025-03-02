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
    .select('*')
    .eq('auth_id', user.id)
    .single()

  return Response.json({ profile: data }, { headers, status: 200 })
}
