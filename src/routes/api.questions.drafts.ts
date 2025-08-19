import { Question } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.getByAuthId(user.id)

  if (!profile) {
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
        author:profiles(id, display_name, username, country, badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url
          )
        ))
  `,
    )
    .or('deleted.eq.false,deleted.is.null')
    .eq('is_draft', true)
    .or(`created_by.eq.${profile.id}`)

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
