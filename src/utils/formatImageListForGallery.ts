import type { IImageGalleryItem } from 'oa-components'
import type { IUploadedFileMeta } from 'src/stores/storage'
import type { IConvertedFileMeta } from 'src/types'
import { cdnImageUrl } from './cdnImageUrl'

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
    })) as IImageGalleryItem[]
}
