import { vi } from 'vitest'

import { createFakeComments } from '../utils'
import { ButtonShowReplies } from './ButtonShowReplies'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ShowRepliesButton',
  component: ButtonShowReplies,
} as Meta<typeof ButtonShowReplies>

const mockSetIsShowReplies = vi.fn()

export const Default: StoryFn<typeof ButtonShowReplies> = () => {
  const replies = createFakeComments(7)

  return (
    <ButtonShowReplies
      creatorName="Jeff"
      isShowReplies={false}
      replies={replies}
      setIsShowReplies={mockSetIsShowReplies}
    />
  )
}

export const RepliesShowing: StoryFn<typeof ButtonShowReplies> = () => {
  const replies = createFakeComments(6)

  return (
    <ButtonShowReplies
      creatorName="Annabeth"
      isShowReplies={true}
      replies={replies}
      setIsShowReplies={mockSetIsShowReplies}
    />
  )
}

export const OneReply: StoryFn<typeof ButtonShowReplies> = () => {
  const replies = createFakeComments(1)

  return (
    <ButtonShowReplies
      creatorName="Zelda"
      isShowReplies={false}
      replies={replies}
      setIsShowReplies={mockSetIsShowReplies}
    />
  )
}

export const NoReplies: StoryFn<typeof ButtonShowReplies> = () => {
  return (
    <ButtonShowReplies
      creatorName="Link"
      isShowReplies={false}
      replies={[]}
      setIsShowReplies={mockSetIsShowReplies}
    />
  )
}
