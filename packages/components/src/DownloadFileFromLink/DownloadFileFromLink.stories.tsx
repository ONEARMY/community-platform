import { DownloadFileFromLink } from './DownloadFileFromLink'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DownloadFileFromLink',
  component: DownloadFileFromLink,
} as Meta<typeof DownloadFileFromLink>

export const Default: StoryFn<typeof DownloadFileFromLink> = () => (
  <DownloadFileFromLink
    fileLink={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
    isLoggedIn
    fileDownloadCount={0}
    files={[]}
    themeStoreDonationProps={{}}
  />
)

export const LoggedOut: StoryFn<typeof DownloadFileFromLink> = () => (
  <DownloadFileFromLink
    fileLink={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
    isLoggedIn={false}
    fileDownloadCount={0}
    files={[]}
    themeStoreDonationProps={{}}
  />
)
