import { News } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { userService } from 'src/services/userService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBNews } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const profileId = await userService.getIdByCurrentAuthUser(client, headers)

  if (!profileId) {
    return Response.json({ items: [], total: 0 }, { headers })
  }

  const result = await client
    .from('news')
    .select('*')
    .or('deleted.eq.false,deleted.is.null')
    .eq('is_draft', true)
    .or(`created_by.eq.${profileId}`)

  if (result.error) {
    console.error(result.error)
    return Response.json({}, { headers, status: 500 })
  }

  if (!result.data || result.data.length === 0) {
    return Response.json({ items: [] }, { headers })
  }

  const drafts = result.data as unknown as DBNews[]
  const items = drafts.map((x) => {
    const image = x.hero_image
      ? storageServiceServer.getPublicUrls(
          client,
          [x.hero_image],
          IMAGE_SIZES.LIST,
        )
      : []

    return News.fromDB(x, [], image[0])
  })

  return Response.json({ items }, { headers })
}
