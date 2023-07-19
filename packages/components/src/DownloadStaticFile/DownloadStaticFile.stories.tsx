import type { StoryFn, Meta } from '@storybook/react'
import { DownloadStaticFile } from './DownloadStaticFile'

export default {
  title: 'Components/DownloadStaticFile',
  component: DownloadStaticFile,
} as Meta<typeof DownloadStaticFile>

export const Default: StoryFn<typeof DownloadStaticFile> = () => (
  <DownloadStaticFile
    file={{
      name: 'example',
      size: 1200000,
      downloadUrl: 'https://example.com',
    }}
  />
)
export const LoggedOut: StoryFn<typeof DownloadStaticFile> = () => (
  <DownloadStaticFile
    file={{
      name: 'example',
      size: 1200000,
      downloadUrl: 'https://example.com',
    }}
    redirectToSignIn={async () => {
      alert('Redirect to Sign In')
    }}
  />
)
