import { IMAGE_SIZES } from 'src/config/imageTransforms'

import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBResearchItem, ResearchItem } from 'oa-shared'

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
    .from('research')
    .select(
      `
       id,
       created_at,
       created_by,
       modified_at,
       title,
       description,
       slug,
       image,
       category:category(id,name),
       tags,
       total_views,
       total_views,
       total_useful,
       status,
       is_draft,
       collaborators,
       author:profiles(id, display_name, username, is_verified, is_supporter, country),
       updates:research_updates(id, created_at, title, description, images, files, file_link, file_download_count, video_url, is_draft, comment_count, modified_at, deleted)
     `,
    )
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .or('deleted.eq.false,deleted.is.null')
    .single()
}

const getUpdate = async (
  client: SupabaseClient,
  researchId: number,
  updateId: number,
) => {
  return client
    .from('research_updates')
    .select(
      'id, research_id, created_at, title, description, images, file_ids, file_link, video_url, is_draft, comment_count, modified_at, deleted',
    )
    .eq('id', updateId)
    .eq('research_id', researchId)
    .single()
}

const getUserResearch = async (
  client: SupabaseClient,
  username: string,
): Promise<Partial<ResearchItem>[]> => {
  const result = await client
    .from('research')
    .select('id, title, slug, total_useful, profiles!inner(username)')
    .eq('profiles.username', username)
    .or('deleted.eq.false, deleted.is.null')

  if (result.error) {
    return []
  }

  return result.data?.map((x) => ({
    id: x.id,
    title: x.title,
    slug: x.slug,
    usefulCount: x.total_useful,
  }))
}

const getResearchPublicMedia = (
  researchDb: DBResearchItem,
  client: SupabaseClient,
) => {
  const allImages =
    researchDb.updates?.flatMap((x) => x.images)?.filter((x) => !!x) || []
  if (researchDb.image) {
    allImages.push(researchDb.image)
  }

  return allImages
    ? storageServiceServer.getPublicUrls(client, allImages, IMAGE_SIZES.GALLERY)
    : []
}

export const researchServiceServer = {
  getBySlug,
  getUserResearch,
  getUpdate,
  getResearchPublicMedia,
}
