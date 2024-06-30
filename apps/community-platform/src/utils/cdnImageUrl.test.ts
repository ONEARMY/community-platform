import { beforeEach } from 'node:test'
import { describe, expect, it, vi } from 'vitest'

import { _cdnImageUrlInternal } from '../utils/cdnImageUrl'
const STORAGE_BUCKET = 'some-bucket'

vi.mock('../../config/config', () => ({
  getConfigurationOption: vi.fn(),
}))

describe('cdnImageUrl', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should ignore invalid URL', () => {
    const CDN_URL = 'xsmasa.masas--'
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const originalUrl =
      'https://firebasestorage.googleapis.com/v0/b/some-bucket/image.jpg'

    expect(_cdnImageUrlInternal(CDN_URL, FIREBASE_CONFIG, originalUrl)).toBe(
      originalUrl,
    )
  })

  it('should return well formed URL if input is poorly formatted', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = ' https://cdn-url.com/ '

    const originalUrl =
      'https://firebasestorage.googleapis.com/v0/b/some-bucket/image.jpg'

    expect(_cdnImageUrlInternal(CDN_URL, FIREBASE_CONFIG, originalUrl)).toBe(
      'https://cdn-url.com/image.jpg',
    )
  })

  it('should return the original URL if CDN_URL or FIREBASE_CONFIG.storageBucket is not set', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = ''

    const originalUrl =
      'https://firebasestorage.googleapis.com/v0/b/some-bucket/image.jpg'

    expect(_cdnImageUrlInternal(CDN_URL, FIREBASE_CONFIG, originalUrl)).toBe(
      originalUrl,
    )
  })

  it('should replace the Firebase storage URL with CDN_URL', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = 'https://cdn-url.com'

    expect(
      _cdnImageUrlInternal(
        CDN_URL,
        FIREBASE_CONFIG,
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg`,
      ),
    ).toBe(`https://cdn-url.com/image.jpg`)
  })

  it('should handle resize params and existing query params', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = 'https://cdn-url.com'
    expect(
      _cdnImageUrlInternal(
        CDN_URL,
        FIREBASE_CONFIG,
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg?query=param`,
        {
          width: 500,
        },
      ),
    ).toBe(`https://cdn-url.com/image.jpg?query=param&width=500`)
  })

  it('should handle resize params', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = 'https://cdn-url.com'

    expect(
      _cdnImageUrlInternal(
        CDN_URL,
        FIREBASE_CONFIG,
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg`,
        {
          width: 500,
        },
      ),
    ).toBe(`https://cdn-url.com/image.jpg?width=500`)
  })

  it('should not modify a non-Firebase URL', () => {
    const FIREBASE_CONFIG = { storageBucket: 'some-bucket' }
    const CDN_URL = 'https://cdn-url.com'

    expect(
      _cdnImageUrlInternal(
        CDN_URL,
        FIREBASE_CONFIG,
        'https://some-other-url.com/image.jpg',
      ),
    ).toBe('https://some-other-url.com/image.jpg')
  })
})
