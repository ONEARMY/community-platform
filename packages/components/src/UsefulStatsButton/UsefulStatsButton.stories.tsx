import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsefulStatsButton } from './UsefulStatsButton'

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as ComponentMeta<typeof UsefulStatsButton>

export const LoggedOut: ComponentStory<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    votedUsefulCount={0}
    hasUserVotedUseful={false}
    onUsefulClick={() => null}
  />
)

export const LoggedOutWithCount: ComponentStory<
  typeof UsefulStatsButton
> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    hasUserVotedUseful={false}
    votedUsefulCount={99}
    onUsefulClick={() => null}
  />
)

export const LoggedInWithCount: ComponentStory<
  typeof UsefulStatsButton
> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={false}
    isLoggedIn={true}
    onUsefulClick={() => null}
  />
)

export const CurrentUserHasVoted: ComponentStory<
  typeof UsefulStatsButton
> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={true}
    isLoggedIn={true}
    onUsefulClick={() => null}
  />
)
