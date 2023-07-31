import { Storage } from '../storage'

const getImageUrlBySize = (fullPath, size: string) => {
  const originalPageParts = fullPath.split('/')

  return Storage.getPublicDownloadUrl(
    originalPageParts.join('/').replace(/.(jpg|png)/, `_${size}x${size}.$1`),
  )
}

export const getResizedImageUrls = (imageFullPath: string) => {
  return {
    thumb: getImageUrlBySize(imageFullPath, '150'),
    small: getImageUrlBySize(imageFullPath, '640'),
    medium: getImageUrlBySize(imageFullPath, '1280'),
    large: getImageUrlBySize(imageFullPath, '1920'),
  }
}
