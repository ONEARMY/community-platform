import { ResearchItem, UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'

import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProfile, DBResearchItem, DBResearchUpdate } from 'oa-shared'

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
       total_useful,
       status,
       is_draft,
       collaborators,
       author:profiles(id, display_name, username, is_verified, is_supporter, country),
       updates:research_updates(
        id, 
        created_at, 
        title, 
        description, 
        images, 
        files, 
        file_link, 
        file_download_count, 
        video_url, 
        is_draft, 
        comment_count, 
        modified_at, 
        deleted,
        update_author:profiles(id, display_name, username, is_verified, is_supporter, country)
      )
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

const isAllowedToEditResearch = async (
  client: SupabaseClient,
  research: ResearchItem,
  currentUsername: string,
) => {
  if (!currentUsername) {
    return false
  }

  if (currentUsername === research.author?.username) {
    return true
  }

  if (
    Array.isArray(research.collaboratorsUsernames) &&
    research.collaboratorsUsernames.includes(currentUsername)
  ) {
    return true
  }

  const { data } = await client
    .from('profiles')
    .select('roles')
    .eq('username', currentUsername)

  return data?.at(0)?.roles?.includes(UserRole.ADMIN)
}

const isAllowedToEditResearchById = async (
  client: SupabaseClient,
  id: number,
  currentUsername: string,
) => {
  const researchResult = await client
    .from('research')
    .select('id,created_by,collaborators')
    .eq('id', id)
    .single()

  const research = researchResult.data as unknown as DBResearchItem

  const item = ResearchItem.fromDB(research, [])

  return isAllowedToEditResearch(client, item, currentUsername)
}

async function getById(id: number, client: SupabaseClient) {
  const result = await client.from('research').select().eq('id', id).single()
  return result.data as DBResearchItem
}

async function getUpdateById(id: number, client: SupabaseClient) {
  const result = await client
    .from('research_updates')
    .select()
    .eq('id', id)
    .single()
  return result.data as DBResearchUpdate
}

async function isAllowedToEditUpdate(
  profile: DBProfile | null,
  researchId: number,
  updateId: number,
  client: SupabaseClient,
) {
  const research = await researchServiceServer.getById(researchId, client)
  const researchUpdate = await researchServiceServer.getUpdateById(
    updateId,
    client,
  )

  if (research.id !== researchUpdate.research_id) {
    return false
  }

  return (
    profile &&
    (profile.id === research.author?.id ||
      research.collaborators?.includes(profile.username) ||
      profile?.roles?.includes(UserRole.ADMIN))
  )
}

export const researchServiceServer = {
  getBySlug,
  getById,
  getUpdateById,
  getUserResearch,
  getUpdate,
  getResearchPublicMedia,
  isAllowedToEditResearch,
  isAllowedToEditResearchById,
  isAllowedToEditUpdate,
}
