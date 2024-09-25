import { cdnImageUrl } from './cdnImageUrl'

import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared'

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
