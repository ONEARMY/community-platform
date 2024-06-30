import { ImageGallery } from './ImageGallery'

import type { Meta, StoryFn } from '@storybook/react'
import type { IImageGalleryItem, ImageGalleryProps } from './ImageGallery'

const imageUrls = [
  {
    full: 'https://picsum.photos/id/29/1500/1000',
    thumb: 'https://picsum.photos/id/29/150/150',
  },
  {
    full: 'https://picsum.photos/id/50/4000/3000',
    thumb: 'https://picsum.photos/id/50/150/150',
  },
  {
    full: 'https://picsum.photos/id/110/800/1200',
    thumb: 'https://picsum.photos/id/110/150/150',
  },
  {
    full: 'https://picsum.photos/id/2/1500/1500',
    thumb: 'https://picsum.photos/id/2/150/150',
  },
]

// eslint-disable-next-line storybook/prefer-pascal-case
export const testImages: IImageGalleryItem[] = imageUrls.map((elt, i) => {
  return {
    downloadUrl: elt.full,
    contentType: 'image/jpeg',
    fullPath: 'cat.jpg',
    name: 'cat' + i,
    type: 'image/jpeg',
    size: 115000,
    thumbnailUrl: elt.thumb,
    timeCreated: new Date().toISOString(),
    updated: new Date().toISOString(),
  }
})

export default {
  title: 'Components/ImageGallery',
  component: ImageGallery,
} as Meta<typeof ImageGallery>

export const Default: StoryFn<typeof ImageGallery> = (
  props: Omit<ImageGalleryProps, 'images'>,
) => {
  return <ImageGallery images={testImages} {...props} />
}

export const NoThumbnails: StoryFn<typeof ImageGallery> = (
  props: Omit<ImageGalleryProps, 'images'>,
) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails />
}

export const HideThumbnailForSingleImage: StoryFn<typeof ImageGallery> = (
  props: Omit<ImageGalleryProps, 'images'>,
) => {
  return <ImageGallery images={[testImages[0]]} {...props} />
}

export const ShowNextPrevButtons: StoryFn<typeof ImageGallery> = (
  props: Omit<ImageGalleryProps, 'images'>,
) => {
  return (
    <ImageGallery
      images={testImages}
      {...props}
      hideThumbnails
      showNextPrevButton={true}
    />
  )
}

export const DoNotShowNextPrevButtons: StoryFn<typeof ImageGallery> = (
  props: Omit<ImageGalleryProps, 'images'>,
) => {
  return (
    <ImageGallery
      images={[testImages[0]]}
      {...props}
      hideThumbnails
      showNextPrevButton={true}
    />
  )
}
