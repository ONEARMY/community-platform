import { cdnImageUrl } from './cdnImageUrl'

import type { IUploadedFileMeta } from 'src/stores/storage'
import type { IConvertedFileMeta } from 'src/types'

export const formatImagesForGallery = (
  imageList: (IUploadedFileMeta | File | IConvertedFileMeta | null)[],
  altPrefix?: string,
) => {
  if (!imageList) {
    return []
  }

  return imageList
    .filter(Boolean)
    .filter((i: any) => !!i?.downloadUrl)
    .map((image: any, index: number) => ({
      downloadUrl: image.downloadUrl,
      thumbnailUrl: cdnImageUrl(image.downloadUrl, {
        width: 150,
      }),
      alt: `${altPrefix ? altPrefix + ' ' : ''}gallery image ${index + 1}`,
    }))
}
