import { render } from '../tests/utils'
import { ImageGallery } from './ImageGallery'

describe('ImageGallery', () => {
  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />)

    expect(container).toBeEmptyDOMElement()
  })
})
