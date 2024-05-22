import { useState } from 'react'

import { UsefulStatsButton } from './UsefulStatsButton'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as Meta<typeof UsefulStatsButton>

export const LoggedOutWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    hasUserVotedUseful={false}
    votedUsefulCount={99}
    onUsefulClick={() => Promise.resolve()}
  />
)

export const LoggedInWithCount: StoryFn<typeof UsefulStatsButton> = () => {
  const [count, setCount] = useState<number>(99)
  const [voted, setVoted] = useState(false)

  const clickVote = async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000))
    setCount((val) => (voted ? val - 1 : val + 1))
    setVoted((val) => !val)
  }

  return (
    <UsefulStatsButton
      votedUsefulCount={count}
      hasUserVotedUseful={voted}
      isLoggedIn={true}
      onUsefulClick={clickVote}
    />
  )
}

export const CurrentUserHasVoted: StoryFn<typeof UsefulStatsButton> = () => {
  const [count, setCount] = useState<number>(100)
  const [voted, setVoted] = useState(true)

  const clickVote = async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000))
    setCount((val) => (voted ? val - 1 : val + 1))
    setVoted((val) => !val)
  }

  return (
    <UsefulStatsButton
      votedUsefulCount={count}
      hasUserVotedUseful={voted}
      isLoggedIn={true}
      onUsefulClick={clickVote}
    />
  )
}
