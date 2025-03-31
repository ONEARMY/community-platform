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

export async function uploadImageCheck(
  id: string | undefined,
  uploadedFile: File | null,
  client: SupabaseClient,
  table: Table,
) {
  if (!uploadedFile || id) {
    return undefined
  }

  if (uploadedFile) {
    const imageValidation = validateImage(uploadedFile)

    if (!imageValidation.valid && imageValidation.error) {
      return Response.json(
        {},
        {
          status: 400,
          statusText: imageValidation.error.message,
        },
      )
    }

    const newsId = Number(id)
    const uploadedImage = uploadedFile
      ? await uploadImage(newsId, uploadedFile, client, table)
      : null
    if (uploadedImage?.image && !uploadedImage.error) {
      return uploadedImage.image
    }
  }
}
