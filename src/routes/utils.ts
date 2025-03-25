import { SUPPORTED_IMAGE_EXTENSIONS } from 'src/utils/storage'

import type { SupabaseClient } from '@supabase/supabase-js'

type Slug = string
type Id = number
type Client = SupabaseClient
type Table = 'questions' | 'news'

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

  const { data } = await client.storage
    .from(process.env.TENANT_ID as string)
    .upload(`${table}/${id}/${uploadedImage.name}`, uploadedImage)

  const error =
    data === null
      ? new Error(`Error uploading image: ${uploadedImage.name}`)
      : null

  return { image: data, error }
}

export function validateImage(image: File | null) {
  const error =
    image?.type && !SUPPORTED_IMAGE_EXTENSIONS.includes(image.type)
      ? new Error(`Unsupported image extension: ${image.type}`)
      : null
  const valid: boolean = !error

  return { valid, error }
}
