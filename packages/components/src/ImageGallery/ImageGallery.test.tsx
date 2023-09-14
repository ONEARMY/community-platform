import { render } from '../tests/utils'
import { ImageGallery } from './ImageGallery'

describe('ImageGallery', () => {
  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders first image', () => {
    const { getByAltText } = render(
      <ImageGallery
        images={[
          {
            downloadUrl: 'https://example.com/image.jpg',
            fullPath: 'image.jpg',
            name: 'image.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
        ]}
      />,
    )

    expect(getByAltText('image.jpg')).toBeInTheDocument()
  })

  it('handles thumbnails', () => {
    const { getByAltText, getAllByAltText, getByTestId } = render(
      <ImageGallery
        images={[
          {
            downloadUrl: 'https://example.com/image.jpg',
            fullPath: 'image.jpg',
            name: 'image.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
          {
            downloadUrl: 'https://example.com/image_001.jpg',
            fullPath: 'image_001.jpg',
            name: 'image_001.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
          {
            downloadUrl: 'https://example.com/image_002.jpg',
            fullPath: 'image_002.jpg',
            name: 'image_002.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
        ]}
      />,
    )

    // Appears twice
    // 1. As active image
    // 2. In thumbnail listing
    expect(getAllByAltText('image.jpg')).toHaveLength(2)

    expect(getByAltText('image_001.jpg')).toBeInTheDocument()
    expect(getByAltText('image_002.jpg')).toBeInTheDocument()

    // Click on thumbnail
    getByAltText('image_001.jpg').click()

    expect(getByTestId('active-image').getAttribute('src')).toBe(
      `https://example.com/image_001.jpg`,
    )
  })

  it('has a lightbox', () => {
    const { getByTestId, getByLabelText } = render(
      <ImageGallery
        images={[
          {
            downloadUrl: 'https://example.com/image.jpg',
            fullPath: 'image.jpg',
            name: 'image.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
          {
            downloadUrl: 'https://example.com/image.jpg',
            fullPath: 'image_001.jpg',
            name: 'image_001.jpg',
            size: 100,
            timeCreated: '2021-01-01',
            type: 'image/jpeg',
            updated: '2021-01-01',
          },
        ]}
      />,
    )

    getByTestId('active-image').click()

    expect(getByLabelText('Lightbox')).toBeInTheDocument()
  })
})
