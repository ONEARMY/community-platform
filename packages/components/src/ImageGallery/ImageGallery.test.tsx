import { faker } from '@faker-js/faker'
import { render } from '../tests/utils'
import { ImageGallery } from './ImageGallery'

const fakeImage = () => ({
  fullPath: faker.internet.url(),
  downloadUrl: faker.internet.url(),
  contentType: 'image/jpeg',
  name: faker.system.commonFileName('.jpg'),
  size: faker.datatype.number(),
  timeCreated: faker.date.past().toISOString(),
  type: 'image',
  updated: faker.date.past().toISOString(),
})

describe('ImageGallery', () => {
  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('handles backwards compatability for images without `sizes` property', () => {
    const { container } = render(<ImageGallery images={[fakeImage()]} />)

    expect(container).not.toBeEmptyDOMElement()
  })

  it('handles multiple images', () => {
    const { container } = render(
      <ImageGallery images={[fakeImage(), fakeImage()]} />,
    )

    expect(container).not.toBeEmptyDOMElement()
  })
})
