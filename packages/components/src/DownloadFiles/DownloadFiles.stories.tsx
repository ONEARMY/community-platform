import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { DownloadFiles } from './DownloadFiles'

export default {
  title: 'Components/DownloadFiles',
  component: DownloadFiles,
} as ComponentMeta<typeof DownloadFiles>

export const Default: ComponentStory<typeof DownloadFiles> = () => (
  <DownloadFiles
    link={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
  />
)
