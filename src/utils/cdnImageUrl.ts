import { CDN_URL, FIREBASE_CONFIG } from 'src/config/config'

type ResizeArgs = {
  width?: number
}

export const cdnImageUrl = (url: string, resizeArgs?: ResizeArgs) => {
  if (!CDN_URL || !FIREBASE_CONFIG.storageBucket) {
    return url
  }

  return (
    url.replace(
      `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}`,
      CDN_URL,
    ) + formatResizeArgsForUrl(resizeArgs, url)
  )
}

const formatResizeArgsForUrl = (
  resizeArgs: ResizeArgs | undefined,
  url: string,
) => {
  if (!resizeArgs) {
    return ''
  }

  const joinChar = url.includes('?') ? '&' : '?'

  return (
    joinChar +
    new URLSearchParams(resizeArgs as Record<string, string>).toString()
  )
}
