import { cdnImageUrl } from './cdnImageUrl'

import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared'
import type { Image } from 'src/models/image.model'

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
      alt: `${altPrefix ? altPrefix + ' ' : ''}Gallery image ${index + 1}`,
    }))
}

export const formatImagesForGalleryV2 = (
  imageList: Image[],
  altPrefix?: string,
) => {
  if (!imageList) {
    return []
  }

  return imageList
    .filter(Boolean)
    .filter((i: Image) => !!i?.fullPath)
    .map((image: Image, index: number) => ({
      downloadUrl: image.fullPath,
      thumbnailUrl: image.fullPath, // TODO
      alt: `${altPrefix ? altPrefix + ' ' : ''}Gallery image ${index + 1}`,
    }))
}
