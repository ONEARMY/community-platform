import { ResearchItem } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const userProfile = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .limit(1)
  const profileId = userProfile.data?.at(0)?.id

  if (!profileId) {
    return Response.json({ items: [], total: 0 }, { headers })
  }

  const result = await client
    .from('research')
    .select(
      `       
        id,
        created_at,
        created_by,
        modified_at,
        description,
        moderation,
        slug,
        category:category(id,created_at,name,type),
        tags,
        title,
        total_views,
        image,
        total_views,
        total_useful,
        status,
        is_draft,
        updates:research_updates(id, created_at, title, description, images, files, file_link, video_url, is_draft, comment_count, modified_at, deleted)
      `,
    )
    .or('deleted.eq.false,deleted.is.null')
    .eq('is_draft', true)
    .eq('created_by', profileId)

  if (result.error) {
    console.error(result.error)
    return Response.json({}, { headers, status: 500 })
  }

  if (!result.data || result.data.length === 0) {
    return Response.json({ items: [] }, { headers })
  }

  const drafts = result.data as unknown as DBResearchItem[]
  const items = drafts.map((x) => {
    const images = x.image
      ? storageServiceServer.getPublicUrls(client, [x.image], IMAGE_SIZES.LIST)
      : []

    return ResearchItem.fromDB(x, [], images)
  })

  return Response.json({ items }, { headers })
}
