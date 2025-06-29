import { tagsServiceServer } from 'src/services/tagsService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContentType, IDBContentDoc } from 'oa-shared'

type Slug = string
type Id = number
type Client = SupabaseClient

const getMetaFields = async (
  client: Client,
  id: Id,
  table: ContentType,
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
  table: ContentType,
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
  table: ContentType,
) {
  const { data } = await client
    .from(table)
    .select('id,slug,previous_slugs')
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .single()

  return !!data?.id && data.id !== id
}

async function isDuplicateNewSlug(
  slug: Slug,
  client: Client,
  table: ContentType,
) {
  const { data } = await client
    .from(table)
    .select('slug,previous_slugs')
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .single()

  return !!data
}

function updatePreviousSlugs(content: IDBContentDoc, newSlug: Slug) {
  if (content.slug !== newSlug) {
    return content.previous_slugs
      ? [...content.previous_slugs, content.slug]
      : [content.slug]
  }

  return content.previous_slugs
}

export const contentServiceServer = {
  getMetaFields,
  incrementViewCount,
  isDuplicateExistingSlug,
  isDuplicateNewSlug,
  updatePreviousSlugs,
}
