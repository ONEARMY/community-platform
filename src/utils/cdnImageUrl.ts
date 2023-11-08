import { FIREBASE_CONFIG, CDN_URL } from 'src/config/config'

export const cdnImageUrl = (url: string) => {
  if (!CDN_URL || !FIREBASE_CONFIG.storageBucket) {
    return url
  }

  return url.replace(
    `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}`,
    CDN_URL,
  )
}
