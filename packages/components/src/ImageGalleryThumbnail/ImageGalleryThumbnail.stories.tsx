import { ImageGalleryThumbnail } from './ImageGalleryThumbnail'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { ImageGalleryThumbnailProps } from './ImageGalleryThumbnail'

export default {
  title: 'Layout/ImageGallery/ImageGalleryThumbnail',
  component: ImageGalleryThumbnail,
} as Meta<typeof ImageGalleryThumbnail>

export const Default: StoryFn<typeof ImageGalleryThumbnail> = (
  props: ImageGalleryThumbnailProps,
) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={0}
      allowPortrait={false}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://picsum.photos/id/29/150/150"
    />
  )
}

export const AllowPortrait: StoryFn<typeof ImageGalleryThumbnail> = (
  props: ImageGalleryThumbnailProps,
) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={0}
      allowPortrait={true}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://picsum.photos/id/29/150/150"
    />
  )
}

export const DisallowPortrait: StoryFn<typeof ImageGalleryThumbnail> = (
  props: ImageGalleryThumbnailProps,
) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={0}
      allowPortrait={false}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://picsum.photos/id/29/150/150"
    />
  )
}

export const ImageIsActive: StoryFn<typeof ImageGalleryThumbnail> = (
  props: ImageGalleryThumbnailProps,
) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={0}
      allowPortrait={false}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://picsum.photos/id/29/150/150"
    />
  )
}

export const ImageIsNotActive: StoryFn<typeof ImageGalleryThumbnail> = (
  props: ImageGalleryThumbnailProps,
) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={1}
      allowPortrait={false}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://picsum.photos/id/29/150/150"
    />
  )
}

export const ThumbnailUrlInvalidAltText: StoryFn<
  typeof ImageGalleryThumbnail
> = (props: ImageGalleryThumbnailProps) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={1}
      allowPortrait={false}
      alt="alt"
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://fastly.picsum.photos/404"
    />
  )
}

export const ThumbnailUrlInvalidNameText: StoryFn<
  typeof ImageGalleryThumbnail
> = (props: ImageGalleryThumbnailProps) => {
  return (
    <ImageGalleryThumbnail
      {...props}
      activeImageIndex={1}
      allowPortrait={false}
      name="name"
      index={0}
      setActiveIndex={() => {}}
      thumbnailUrl="https://fastly.picsum.photos/404"
    />
  )
}
