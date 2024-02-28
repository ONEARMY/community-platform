import { ImageCrop } from './ImageCrop'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ImageCrop',
  component: ImageCrop,
} as Meta<typeof ImageCrop>

export const Default: StoryFn<typeof ImageCrop> = () => (
  <div style={{ width: '600px' }}>
    <ImageCrop
      aspect={1}
      callbackFn={() => Promise.resolve('http://upload.path/')}
      callbackLabel="Upload image"
      imgSrc="https://onearmy.github.io/academy/assets/comm_badges.jpg"
      subTitle="Before uploading, select how we should crop the image to fit."
      title="Select crop"
    />
  </div>
)
