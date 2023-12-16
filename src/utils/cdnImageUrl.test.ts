const STORAGE_BUCKET = 'some-bucket'

describe('cdnImageUrl', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return the original URL if CDN_URL or FIREBASE_CONFIG.storageBucket is not set', () => {
    // Mocking empty CDN_URL
    jest.doMock('src/config/config', () => ({
      FIREBASE_CONFIG: { storageBucket: 'some-bucket' },
      CDN_URL: '',
    }))

    const { cdnImageUrl } = require('src/utils/cdnImageUrl')
    const originalUrl =
      'https://firebasestorage.googleapis.com/v0/b/some-bucket/image.jpg'

    expect(cdnImageUrl(originalUrl)).toBe(originalUrl)
  })

  it('should replace the Firebase storage URL with CDN_URL', () => {
    jest.mock('src/config/config', () => ({
      FIREBASE_CONFIG: { storageBucket: 'some-bucket' },
      CDN_URL: 'https://cdn-url.com',
    }))

    const { cdnImageUrl } = require('src/utils/cdnImageUrl')

    expect(
      cdnImageUrl(
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg`,
      ),
    ).toBe(`https://cdn-url.com/image.jpg`)
  })

  it('should handle resize params and existing query params', () => {
    jest.mock('src/config/config', () => ({
      FIREBASE_CONFIG: { storageBucket: 'some-bucket' },
      CDN_URL: 'https://cdn-url.com',
    }))

    const { cdnImageUrl } = require('src/utils/cdnImageUrl')

    expect(
      cdnImageUrl(
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg?query=param`,
        {
          width: 500,
        },
      ),
    ).toBe(`https://cdn-url.com/image.jpg?query=param&width=500`)
  })

  it('should handle resize params', () => {
    jest.mock('src/config/config', () => ({
      FIREBASE_CONFIG: { storageBucket: 'some-bucket' },
      CDN_URL: 'https://cdn-url.com',
    }))

    const { cdnImageUrl } = require('src/utils/cdnImageUrl')

    expect(
      cdnImageUrl(
        `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/image.jpg`,
        {
          width: 500,
        },
      ),
    ).toBe(`https://cdn-url.com/image.jpg?width=500`)
  })

  it('should not modify a non-Firebase URL', () => {
    jest.mock('src/config/config', () => ({
      FIREBASE_CONFIG: { storageBucket: 'some-bucket' },
      CDN_URL: 'https://cdn-url.com',
    }))

    const { cdnImageUrl } = require('src/utils/cdnImageUrl')

    expect(cdnImageUrl('https://some-other-url.com/image.jpg')).toBe(
      'https://some-other-url.com/image.jpg',
    )
  })
})
