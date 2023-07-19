import type { StoryFn, Meta } from '@storybook/react'
import { DownloadFileFromLink } from './DownloadFileFromLink'

export default {
  title: 'Components/DownloadFileFromLink',
  component: DownloadFileFromLink,
} as Meta<typeof DownloadFileFromLink>

export const Default: StoryFn<typeof DownloadFileFromLink> = () => (
  <DownloadFileFromLink
    link={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
  />
)

export const LoggedOut: StoryFn<typeof DownloadFileFromLink> = () => (
  <DownloadFileFromLink
    link={'https://example.com'}
    handleClick={async () => {
      alert('Clicked')
    }}
    redirectToSignIn={async () => {
      alert('Redirect to Sign In')
    }}
  />
)
