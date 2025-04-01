import { Tag } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'

const getAllTags = async () => {
  try {
    const response = await fetch('/api/tags')
    return (await response.json()) as Tag[]
  } catch (error) {
    console.error({ error })
    return []
  }
}

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

export const tagsService = {
  getAllTags,
  getTags,
}
