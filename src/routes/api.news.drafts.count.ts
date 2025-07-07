import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { userService } from 'src/services/userService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const profileId = await userService.getIdByCurrentAuthUser(client, headers)

  if (!profileId) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'invalid user' },
    )
  }

  const count = await contentServiceServer.getDraftCount(
    client,
    profileId,
    'news',
  )

  return Response.json({ total: count }, { headers })
}
