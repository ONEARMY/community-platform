import { Tag } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'

const getTags = async (client: SupabaseClient, tagIds: number[]) => {
  let tags: Tag[] = []

  if (tagIds?.length > 0) {
    const tagsResult = await client
      .from('tags')
      .select('id,name,created_at,modified_at')
      .in('id', tagIds)

    if (tagsResult.data) {
      tags = tagsResult.data.map((x) => Tag.fromDB(x))
    }
  }

  return tags
}

export const tagsServiceServer = {
  getTags,
}
