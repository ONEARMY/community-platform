import type { Meta, StoryFn } from '@storybook/react'
import { DownloadFiles } from './DownloadFiles'

export default {
  title: 'Components/DownloadFiles',
  component: DownloadFiles,
} as Meta<typeof DownloadFiles>

export const Default: StoryFn<typeof DownloadFiles> = () => (
  <DownloadFiles
    link={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
  />
)
