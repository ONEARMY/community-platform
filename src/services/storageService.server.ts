import { Image } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBImage } from 'oa-shared'
import type { ImageSize } from 'src/config/imageTransforms'

const getImagesPublicUrls = (
  client: SupabaseClient,
  images: DBImage[],
  size?: ImageSize,
) => {
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

export const storageServiceServer = {
  getImagesPublicUrls,
}
