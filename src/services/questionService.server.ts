import type { SupabaseClient } from '@supabase/supabase-js'
import type { Question } from 'oa-shared'

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
    .from('questions')
    .select(
      `
       id,
       created_at,
       created_by,
       modified_at,
       comment_count,
       description,
       moderation,
       slug,
       category:category(id,name),
       tags,
       title,
       total_views,
       images,
       author:profiles(id, display_name, username, is_verified, is_supporter, country)
     `,
    )
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .or('deleted.eq.false,deleted.is.null')
    .single()
}

const getQuestionsByUser = async (
  client: SupabaseClient,
  username: string,
): Promise<Partial<Question>[]> => {
  const functionResult = await client.rpc('get_user_questions', {
    username_param: username,
  })

  if (functionResult.error || functionResult.count === 0) {
    return []
  }

  const items = functionResult.data.map((x) => {
    return {
      id: x.id,
      title: x.title,
      slug: x.slug,
      usefulCount: x.total_useful,
    }
  })

  return items
}

export const questionServiceServer = {
  getBySlug,
  getQuestionsByUser,
}
