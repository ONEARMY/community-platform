import { Question } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { userService } from 'src/services/userService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const profileId = await userService.getIdByCurrentAuthUser(client, headers)

  if (!profileId) {
    return Response.json({ items: [], total: 0 }, { headers })
  }

  const result = await client
    .from('questions')
    .select(
      `
        id,
        created_at,
        created_by,
        modified_at,
        title,
        slug,
        category:category(id,name),
        is_draft,
        comment_count,
        author:profiles(id, display_name, username, is_verified, is_supporter, country)
  `,
    )
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

  const drafts = result.data as unknown as DBQuestion[]
  const items = drafts.map((x) => {
    const images = x.images
      ? storageServiceServer.getPublicUrls(client, x.images, IMAGE_SIZES.LIST)
      : []

    return Question.fromDB(x, [], images)
  })

  return Response.json({ items }, { headers })
}
