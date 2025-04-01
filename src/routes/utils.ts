import { tagsService } from 'src/services/tagsService'
import { SUPPORTED_IMAGE_EXTENSIONS } from 'src/utils/storage'

import type { SupabaseClient } from '@supabase/supabase-js'

type Slug = string
type Id = number
type Client = SupabaseClient
type Table = 'questions' | 'news'

export const getMetaFields = async (
  client: Client,
  id: Id,
  tagIds: number[],
) => {
  return await Promise.all([
    client
      .from('useful_votes')
      .select('*', { count: 'exact' })
      .eq('content_id', id)
      .eq('content_type', 'news'),
    client
      .from('subscribers')
      .select('user_id', { count: 'exact' })
      .eq('content_id', id)
      .eq('content_type', 'news'),
    await tagsService.getTags(client, tagIds),
  ])
}

export const incrementViewCount = async (
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

export async function isDuplicateExistingSlug(
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

export async function isDuplicateNewSlug(
  slug: Slug,
  client: Client,
  table: Table,
) {
  const { data } = await client
    .from(table)
    .select('slug')
    .eq('slug', slug)
    .single()

  return !!data
}

export async function uploadImage(
  id: Id,
  uploadedImage: File,
  client: SupabaseClient,
  table: Table,
) {
  if (!uploadedImage) {
    return null
  }
  const response = await client.storage
    .from(process.env.TENANT_ID as string)
    .upload(`${table}/${id}/${uploadedImage.name}`, uploadedImage)

  const image = response.data
  const error =
    image === null
      ? new Error(`Uploading image: ${response.error.message}`)
      : null

  return { image, error }
}

export function validateImage(image: File | null) {
  const error =
    image?.type && !SUPPORTED_IMAGE_EXTENSIONS.includes(image.type)
      ? new Error(`Unsupported image extension: ${image.type}`)
      : null
  const valid: boolean = !error

  return { valid, error }
}

export function validateImages(images: File[]) {
  const errors: Error[] = []
  for (const image of images) {
    const { error } = validateImage(image)
    if (error) {
      errors.push(error)
    }
    continue
  }

  return { valid: errors.length === 0, errors }
}
