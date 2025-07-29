import { Project } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBProject } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const profile = await profileServiceServer.getByAuthId(user.id, client)

  if (!profile) {
    return Response.json({ items: [], total: 0 }, { headers })
  }

  const result = await client
    .from('projects')
    .select(
      `       
        id,
        created_at,
        created_by,
        modified_at,
        title,
        description,
        slug,
        cover_image,
        category:category(id,name),
        tags,
        moderation,
        is_draft,
        author:profiles(id, display_name, username, is_verified, is_supporter, country),
        steps:project_steps(
          id, 
          created_at, 
          title, 
          description
        )
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

  const drafts = result.data as unknown as DBProject[]
  const items = drafts.map((x) => {
    const images = x.cover_image
      ? storageServiceServer.getPublicUrls(
          client,
          [x.cover_image],
          IMAGE_SIZES.LIST,
        )
      : []

    return Project.fromDB(x, [], images)
  })

  return Response.json({ items }, { headers })
}
