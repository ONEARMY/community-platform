import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json(
      {},
      { headers, status: 401, statusText: 'Unauthorized' },
    )
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.getByAuthId(user.id)

  if (!profile) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'invalid user' },
    )
  }

  const count = await contentServiceServer.getDraftCount(
    client,
    profile.id,
    'news',
  )

  return Response.json({ total: count }, { headers })
}
