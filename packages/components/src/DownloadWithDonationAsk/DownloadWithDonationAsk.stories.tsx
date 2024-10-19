import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DownloadWithDonationAsk',
  component: DownloadWithDonationAsk,
} as Meta<typeof DownloadWithDonationAsk>

export const Default: StoryFn<typeof DownloadWithDonationAsk> = () => (
  <DownloadWithDonationAsk
    fileLink={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
    isLoggedIn
    fileDownloadCount={0}
    files={[]}
  />
)

export const LoggedOut: StoryFn<typeof DownloadWithDonationAsk> = () => (
  <DownloadWithDonationAsk
    fileLink={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
    isLoggedIn={false}
    fileDownloadCount={0}
    files={[]}
  />
)
