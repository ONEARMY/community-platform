import { MediaFile } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContentType, DBImage } from 'oa-shared'
import type { ImageSize } from 'src/config/imageTransforms'

const getPublicUrls = (
  client: SupabaseClient,
  images: DBMedia[],
  size?: ImageSize,
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
    return data as Image
  })
}

const uploadMedia = async (
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
      .upload(`${path}/${file.name}`, file)

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`)
      continue
    }

    media.push(result.data)
  }

  return { media, errors }
}

const getContentTypeFiles = async (
  contentType: 'research' | 'library',
  contentId: number,
  client: SupabaseClient,
) => {
  const documentsBucket = process.env.TENANT_ID + '-documents'
  const { data, error } = await client.storage
    .from(documentsBucket)
    .list(`${contentType}/${contentId}`)

  if (!data || error) {
    return []
  }

  return data?.map(
    (x) =>
      new MediaFile({
        id: x.id,
        name: x.name,
        size: x.metadata.size,
        url: `/api/documents/${contentType}/${contentId}/${x.id}`,
      }),
  )
}

export const storageServiceServer = {
  getPublicUrls,
  uploadMedia,
  getContentTypeFiles,
}
