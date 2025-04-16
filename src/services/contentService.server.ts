import { tagsServiceServer } from 'src/services/tagsService.server'

import type { SupabaseClient } from '@supabase/supabase-js'

type Slug = string
type Id = number
type Client = SupabaseClient
type Table = 'questions' | 'news' | 'research'

const getMetaFields = async (
  client: Client,
  id: Id,
  table: Table,
  tagIds: number[],
) => {
  return await Promise.all([
    client
      .from('useful_votes')
      .select('*', { count: 'exact' })
      .eq('content_id', id)
      .eq('content_type', table),
    client
      .from('subscribers')
      .select('user_id', { count: 'exact' })
      .eq('content_id', id)
      .eq('content_type', table),
    tagsServiceServer.getTags(client, tagIds),
  ])
}

const incrementViewCount = async (
  client: Client,
  table: Table,
  totalViews: number | undefined,
  id: Id,
) => {
  return await client
    .from(table)
    .update({ total_views: (totalViews || 0) + 1 })
    .eq('id', id)
}

async function isDuplicateExistingSlug(
  slug: Slug,
  id: Id,
  client: Client,
  table: Table,
) {
  const { data } = await client
    .from(table)
    .select('id,slug')
    .eq('slug', slug)
    .single()

  return !!data?.id && data.id !== id
}

async function isDuplicateNewSlug(slug: Slug, client: Client, table: Table) {
  const { data } = await client
    .from(table)
    .select('slug')
    .eq('slug', slug)
    .single()

  return !!data
}

export const contentServiceServer = {
  getMetaFields,
  incrementViewCount,
  isDuplicateExistingSlug,
  isDuplicateNewSlug,
}
