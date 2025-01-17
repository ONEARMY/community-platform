import { DownloadStaticFile } from './DownloadStaticFile'

import type { Meta, StoryFn } from '@storybook/react'

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
    fileDownloadCount={346}
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
    fileDownloadCount={6}
  />
)
