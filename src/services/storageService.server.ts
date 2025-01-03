import { Image } from 'src/models/image.model'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImageSize } from 'src/config/imageTransforms'
import type { DBImage } from 'src/models/image.model'

const getImagesPublicUrls = (
  client: SupabaseClient,
  images: DBImage[],
  size: ImageSize,
) => {
  return images?.map((x) => {
    const { data } = client.storage
      .from(process.env.TENANT_ID as string)
      .getPublicUrl(x.path, {
        transform: {
          height: size,
        },
      })
    return new Image({ id: x.id, publicUrl: data.publicUrl })
  })
}

export const storageServiceServer = {
  getImagesPublicUrls,
}
