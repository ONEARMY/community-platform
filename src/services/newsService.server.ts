import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMedia } from 'oa-shared'

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
       summary,
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
  dbImage: DBMedia | null,
) => {
  if (!dbImage) {
    return null
  }

  const size = { width: 1240, height: 620 }
  const images = storageServiceServer.getPublicUrls(client, [dbImage], size)

  return images[0]
}

export const newsServiceServer = {
  getBySlug,
  getHeroImage,
}
