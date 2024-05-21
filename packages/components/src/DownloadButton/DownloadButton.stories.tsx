import { DownloadButton } from './DownloadButton'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DownloadButton',
  component: DownloadButton,
} as Meta<typeof DownloadButton>

export const Default: StoryFn<typeof DownloadButton> = () => <DownloadButton />
