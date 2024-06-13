import { cdnImageUrl } from './cdnImageUrl'

import type { IUploadedFileMeta } from 'src/stores/storage'
import type { IConvertedFileMeta } from 'src/types'

export const formatImagesForGallery = (
  imageList: (IUploadedFileMeta | File | IConvertedFileMeta | null)[],
) => {
  if (!imageList) {
    return []
  }

  return imageList
    .filter(Boolean)
    .filter((i: any) => !!i?.downloadUrl)
    .map((i: any) => ({
      downloadUrl: i.downloadUrl,
      thumbnailUrl: cdnImageUrl(i.downloadUrl, {
        width: 150,
      }),
    }))
}
