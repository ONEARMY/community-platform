import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FileInformation } from './FileInformation'

export default {
  title: 'Components/FileInformation',
  component: FileInformation,
} as ComponentMeta<typeof FileInformation>

export const Default: ComponentStory<typeof FileInformation> = () => (
  <FileInformation
    file={{
      name: 'example',
      size: 1200000,
      downloadUrl: 'https://example.com',
    }}
  />
)
