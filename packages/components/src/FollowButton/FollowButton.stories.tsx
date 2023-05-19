import type { StoryFn, Meta } from '@storybook/react'
import { FollowButton } from './FollowButton'

export default {
  title: 'Components/FollowButton',
  component: FollowButton,
} as Meta<typeof FollowButton>

export const LoggedOut: StoryFn<typeof FollowButton> = () => (
  <FollowButton
    isLoggedIn={false}
    hasUserSubscribed={false}
    onFollowClick={() => null}
  />
)

export const LoggedIn: StoryFn<typeof FollowButton> = () => (
  <FollowButton
    hasUserSubscribed={false}
    isLoggedIn={true}
    onFollowClick={() => null}
  />
)

export const CurrentUserSubscribed: StoryFn<typeof FollowButton> = () => (
  <FollowButton
    hasUserSubscribed={true}
    isLoggedIn={true}
    onFollowClick={() => null}
  />
)
