import { Question } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBQuestion } from 'shared/lib'

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
  //gets foreign key for username
  const id = await client
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (id.error) {
    return []
  }

  //gets all quests, filters by created_by using above foreign key
  const queryResult = await client
    .from('questions')
    .select(
      'id, created_at, created_by, modified_at, comment_count, description, moderation, slug, category:category(id,name), tags, title, total_views, images',
    )
    .eq('created_by', id.data.id)

  if (queryResult.error) {
    return []
  }

  const data = queryResult.data as unknown as DBQuestion[]
  const items = data.map((x) => Question.fromDB(x, [], []))

  //populates useful votes
  if (items && items.length > 0) {
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'questions',
      p_content_ids: items.map((x) => x.id),
    })

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count)
        return acc
      }, new Map())

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!
        }
      }
    }
  }

  return items
}

export const questionServiceServer = {
  getBySlug,
  getQuestionsByUser,
}
