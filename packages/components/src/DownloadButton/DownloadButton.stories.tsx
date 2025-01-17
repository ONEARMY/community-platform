import { DownloadButton } from './DownloadButton'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DownloadButton',
  component: DownloadButton,
} as Meta<typeof DownloadButton>

export const Default: StoryFn<typeof DownloadButton> = () => (
  <DownloadButton onClick={() => {}} fileDownloadCount={7} />
)

export const CustomDetails: StoryFn<typeof DownloadButton> = () => (
  <DownloadButton
    onClick={() => {}}
    glyph="download-cloud"
    label="Hello there"
    fileDownloadCount={726}
  />
)
