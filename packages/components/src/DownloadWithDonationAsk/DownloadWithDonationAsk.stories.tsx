import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DownloadWithDonationAsk',
  component: DownloadWithDonationAsk,
} as Meta<typeof DownloadWithDonationAsk>

const downloadProps = {
  body: 'Body Text for the donation request',
  iframeSrc: 'https://donorbox.org/embed/ppcpdonor?language=en',
  imageURL:
    'https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9',
  fileDownloadCount: 45,
  fileLink: 'https://example.com',
  handleClick: async () => {
    alert('Clicked')
  },
  files: [],
}

export const Default: StoryFn<typeof DownloadWithDonationAsk> = () => (
  <DownloadWithDonationAsk {...downloadProps} />
)
