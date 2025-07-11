import { Image, MediaFile } from 'oa-shared'

import type { TransformOptions } from '@supabase/storage-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMedia } from 'oa-shared'

const getPublicUrls = (
  client: SupabaseClient,
  images: DBMedia[],
  size?: TransformOptions,
): Image[] => {
  return images?.map((x) => {
    const { data } = client.storage
      .from(process.env.TENANT_ID as string)
      .getPublicUrl(
        x.path,
        size
          ? {
              transform: size,
            }
          : undefined,
      )
    return new Image({ id: x.id, publicUrl: data.publicUrl })
  })
}

const uploadImage = async (
  files: File[],
  path: string,
  client: SupabaseClient,
) => {
  if (!files || files.length === 0) {
    return null
  }

  const errors: string[] = []
  const media: DBMedia[] = []

  for (const file of files) {
    const result = await client.storage
      .from(process.env.TENANT_ID as string)
      .upload(`${path}/${file.name}`, file, { upsert: true })

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`)
      continue
    }

    media.push(result.data)
  }

  return { media, errors }
}

const uploadFile = async (
  files: File[],
  path: string,
  client: SupabaseClient,
) => {
  if (!files || files.length === 0) {
    return null
  }

  const errors: string[] = []
  const media: MediaFile[] = []

  for (const file of files) {
    const result = await client.storage
      .from(process.env.TENANT_ID + '-documents')
      .upload(`${path}/${file.name}`, file)

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`)
      continue
    }

    media.push({
      id: result.data.id,
      name: result.data.path.split('/').at(-1)!,
      size: file.size,
    })
  }

  return { media, errors }
}

const removeFiles = async (paths: string[], client: SupabaseClient) => {
  await client.storage.from(process.env.TENANT_ID + '-documents').remove(paths)
}

const removeImages = async (paths: string[], client: SupabaseClient) => {
  await client.storage.from(process.env.TENANT_ID as string).remove(paths)
}

const getPathDocuments = async (
  path: string,
  mapUrlPrefix: string,
  client: SupabaseClient,
) => {
  const documentsBucket = process.env.TENANT_ID + '-documents'

  const { data, error } = await client.storage.from(documentsBucket).list(path)

  if (!data || error) {
    return []
  }

  return data?.map(
    (x) =>
      new MediaFile({
        id: x.id,
        name: x.name,
        size: x.metadata.size,
        url: `${mapUrlPrefix}/${x.id}`,
      }),
  )
}

export const storageServiceServer = {
  getPublicUrls,
  uploadImage,
  uploadFile,
  removeFiles,
  removeImages,
  getPathDocuments,
}
