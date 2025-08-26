import { ProfileFactory } from 'src/factories/profileFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { DBProfile } from 'oa-shared'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const q = params.get('q')

  if (!q) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'q is required' },
    )
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const { data } = await client
    .from('profiles')
    .select(
      `
      id,
      username,
      display_name,
      photo,
      country,
      created_at,
      badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
        )
      )`,
    )
    .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
    .limit(10)
  const profileFactory = new ProfileFactory(client)

  const profiles = data?.map((x) =>
    profileFactory.fromDB(x as unknown as DBProfile),
  )

  return Response.json(profiles, { headers, status: 200 })
}
