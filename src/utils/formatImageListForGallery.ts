import { cdnImageUrl } from './cdnImageUrl'

import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared'
import type { Media } from 'src/models/image.model'

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
  imageList: Media[],
  altPrefix?: string,
) => {
  if (!imageList) {
    return []
  }

  return imageList
    .filter(Boolean)
    .filter((i: Media) => !!i?.publicUrl)
    .map((image: Media, index: number) => ({
      downloadUrl: image.publicUrl.split('?')[0],
      thumbnailUrl: image.publicUrl,
      alt: `${altPrefix ? altPrefix + ' ' : ''}Gallery image ${index + 1}`,
    }))
}
