import { Media } from 'src/models/image.model'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImageSize } from 'src/config/imageTransforms'
import type { DBMedia } from 'src/models/image.model'

const getImagesPublicUrls = (
  client: SupabaseClient,
  images: DBMedia[],
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
    return new Media({ id: x.id, publicUrl: data.publicUrl })
  })
}

export const storageServiceServer = {
  getImagesPublicUrls,
}
