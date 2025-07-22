import type { Image } from 'oa-shared'

export const formatImagesForGallery = (
  imageList: Image[],
  altPrefix?: string,
) => {
  if (!imageList) {
    return []
  }

  return imageList
    .filter(Boolean)
    .filter((i: Image) => !!i?.publicUrl)
    .map((image: Image, index: number) => ({
      downloadUrl: image.publicUrl,
      thumbnailUrl: image.publicUrl,
      alt: `${altPrefix ? altPrefix + ' ' : ''}Gallery image ${index + 1}`,
    }))
}
