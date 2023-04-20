import type { StoryFn, Meta } from '@storybook/react'
import { UsefulStatsButton } from './UsefulStatsButton'

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as Meta<typeof UsefulStatsButton>

export const LoggedOut: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    votedUsefulCount={0}
    hasUserVotedUseful={false}
    onUsefulClick={() => null}
  />
)

export const LoggedOutWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    hasUserVotedUseful={false}
    votedUsefulCount={99}
    onUsefulClick={() => null}
  />
)

export const LoggedInWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={false}
    isLoggedIn={true}
    onUsefulClick={() => null}
  />
)

export const CurrentUserHasVoted: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={true}
    isLoggedIn={true}
    onUsefulClick={() => null}
  />
)
