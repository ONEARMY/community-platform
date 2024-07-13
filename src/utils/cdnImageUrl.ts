import { CDN_URL, FIREBASE_CONFIG } from 'src/config/config'
import { logger } from 'src/logger'

import type { IFirebaseConfig } from 'src/config/types'

type ResizeArgs = {
  width?: number
}

export const cdnImageUrl = (url: string, resizeArgs?: ResizeArgs) => {
  return _cdnImageUrlInternal(CDN_URL, FIREBASE_CONFIG, url, resizeArgs)
}

export const _cdnImageUrlInternal = (
  cdnUrl: string,
  firebaseConfig: Partial<IFirebaseConfig>,
  url: string,
  resizeArgs?: ResizeArgs,
) => {
  if (!cdnUrl || !firebaseConfig.storageBucket) {
    return url
  }

  const sanitizedCdnUrl = cdnUrl.trim().replace(/\/$/, '')

  try {
    new URL(sanitizedCdnUrl)
  } catch (e) {
    logger.warn('Invalid CDN_URL', e)
    return url
  }

  return (
    url.replace(
      `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}`,
      sanitizedCdnUrl,
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
