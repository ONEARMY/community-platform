import { Image } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBImage } from 'oa-shared'
import type { ImageSize } from 'src/config/imageTransforms'

const getImagesPublicUrls = async (
  client: SupabaseClient,
  images: DBImage[],
  size?: ImageSize,
) => {
  const imageList: Image[] = []

  images?.forEach(async (image) => {
    const response = await client.storage
      .from(process.env.TENANT_ID as string)
      .getPublicUrl(image.path, size ? { transform: size } : undefined)
    imageList.push(
      new Image({ id: image.id, publicUrl: response.data.publicUrl }),
    )
  })

  return imageList
}

export const storageServiceServer = {
  getImagesPublicUrls,
}
