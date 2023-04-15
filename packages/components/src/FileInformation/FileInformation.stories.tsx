import type { StoryFn, Meta } from '@storybook/react'
import { FileInformation } from './FileInformation'

export default {
  title: 'Components/FileInformation',
  component: FileInformation,
} as Meta<typeof FileInformation>

export const Default: StoryFn<typeof FileInformation> = () => (
  <FileInformation
    file={{
      name: 'example',
      size: 1200000,
      downloadUrl: 'https://example.com',
    }}
  />
)
