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
      publicUrl: 'https://example.com',
      id: '',
    }}
    fileDownloadCount={346}
  />
)
export const LoggedOut: StoryFn<typeof DownloadStaticFile> = () => (
  <DownloadStaticFile
    file={{
      name: 'example',
      size: 1200000,
      publicUrl: 'https://example.com',
      id: '',
    }}
    redirectToSignIn={async () => {
      alert('Redirect to Sign In')
    }}
    fileDownloadCount={6}
  />
)
