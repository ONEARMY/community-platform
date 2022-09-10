import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsefulStatsButton } from './UsefulStatsButton'

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as ComponentMeta<typeof UsefulStatsButton>

export const LoggedOut: ComponentStory<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton votedUsefulCount={0} />
)

export const LoggedOutWithCount: ComponentStory<
  typeof UsefulStatsButton
> = () => <UsefulStatsButton votedUsefulCount={99} />

export const LoggedInWithCount: ComponentStory<
  typeof UsefulStatsButton
> = () => <UsefulStatsButton votedUsefulCount={99} isLoggedIn />

export const CurrentUserHasVoted: ComponentStory<
  typeof UsefulStatsButton
> = () => (
  <UsefulStatsButton
    votedUsefulCount={99}
    hasUserVotedUseful={true}
    isLoggedIn
  />
)
