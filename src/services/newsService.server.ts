import { type DBImage, Tag } from 'oa-shared'

import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
    .from('news')
    .select(
      `
       id,
       created_at,
       created_by,
       modified_at,
       comment_count,
       body,
       moderation,
       slug,
       category:category(id,name),
       tags,
       title,
       total_views,
       tenant_id,
       hero_image,
       author:profiles(id, firebase_auth_id, display_name, username, is_verified, is_supporter, country)
     `,
    )
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .or('deleted.eq.false,deleted.is.null')
    .single()
}

const getHeroImage = async (
  client: SupabaseClient,
  dbImage: DBImage | null,
) => {
  const images = dbImage
    ? await storageServiceServer.getImagesPublicUrls(client, [dbImage], {
        width: 600,
        height: 300,
      })
    : []

  return images[0] || null
}

const getTags = async (client: SupabaseClient, tagIds: number[]) => {
  let tags: Tag[] = []

  if (tagIds?.length > 0) {
    const tagsResult = await client
      .from('tags')
      .select('id,name')
      .in('id', tagIds)

    if (tagsResult.data) {
      tags = tagsResult.data.map((x) => Tag.fromDB(x))
    }
  }

  return tags
}

export const newsServiceServer = {
  getBySlug,
  getHeroImage,
  getTags,
}
