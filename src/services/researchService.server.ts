import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResearchItem } from 'src/models/research.model'

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
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
       category:category(id,name),
       tags,
       title,
       total_views,
       images,
       total_views,
       total_useful,
       status,
       is_draft,
       author:profiles(id, display_name, username, is_verified, is_supporter, country),
       collaborators:profiles(id, display_name, username, is_verified, is_supporter, country),
       updates:research_updates(id, created_at, title, description, images, files, file_link, video_url, is_draft, comment_count, modified_at, deleted)
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
      'id, research_id, created_at, title, description, images, files, file_link, video_url, is_draft, comment_count, modified_at, deleted',
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

export const researchServiceServer = {
  getBySlug,
  getUserResearch,
  getUpdate,
}
