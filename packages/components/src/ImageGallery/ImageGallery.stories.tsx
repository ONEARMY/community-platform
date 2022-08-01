import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ImageGallery } from './ImageGallery'

interface IUploadedFileMeta {
  downloadUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  type: string
  size: number
  timeCreated: string
  updated: string
}

const imageUrls = [
  'https://picsum.photos/1500/500',
  'https://picsum.photos/4000/3000',
  'https://picsum.photos/800/1200',
  'https://picsum.photos/1500/1500',
]

const testImages: IUploadedFileMeta[] = imageUrls.map((elt, i) => {
  return {
    downloadUrl: elt,
    contentType: 'image/jpeg',
    fullPath: 'cat.jpg',
    name: 'cat' + i,
    type: 'image/jpeg',
    size: 115000,
    timeCreated: new Date().toISOString(),
    updated: new Date().toISOString(),
  }
})

export default {
  title: 'Base Components/ImageGallery',
  component: ImageGallery,
} as ComponentMeta<typeof ImageGallery>

export const Default: ComponentStory<typeof ImageGallery> = () => {
  return <ImageGallery images={testImages} />
}
