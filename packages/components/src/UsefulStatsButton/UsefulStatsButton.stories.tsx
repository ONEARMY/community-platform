import { UsefulStatsButton } from './UsefulStatsButton'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as Meta<typeof UsefulStatsButton>

export const LoggedOut: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    votedUsefulCount={0}
    hasUserVotedUseful={false}
    onUsefulClick={() => new Promise(() => {})}
  />
)

export const LoggedOutWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    hasUserVotedUseful={false}
    votedUsefulCount={99}
    onUsefulClick={() => new Promise(() => {})}
  />
)

export const LoggedInWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={false}
    isLoggedIn={true}
    onUsefulClick={() => new Promise(() => {})}
  />
)

export const CurrentUserHasVoted: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={true}
    isLoggedIn={true}
    onUsefulClick={() => new Promise(() => {})}
  />
)
