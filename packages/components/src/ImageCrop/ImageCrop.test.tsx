import { render } from '../tests/utils'
import { Default } from './ImageCrop.stories'

import type { ImageCropProps } from './ImageCrop'

describe('ImageCrop', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as ImageCropProps)} />,
    )

    expect(getByText('ImageCrop')).toBeInTheDocument()
  })
})
