import { fakeComment } from '../utils'
import { CommentContainer } from './CommentContainer'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/CommentContainer',
  component: CommentContainer,
} as Meta<typeof CommentContainer>

export const Default: StoryFn<typeof CommentContainer> = () => {
  const comment = fakeComment()

  return (
    <CommentContainer
      canHaveReplies={false}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
    />
  )
}

export const WithReplies: StoryFn<typeof CommentContainer> = () => {
  const reply = fakeComment()
  const comment = fakeComment({ replies: [reply] })

  return (
    <CommentContainer
      canHaveReplies={true}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
    />
  )
}

export const WithLotsReplies: StoryFn<typeof CommentContainer> = () => {
  const replies = Array(15).fill(fakeComment())
  const comment = fakeComment({ replies })

  return (
    <CommentContainer
      canHaveReplies={true}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
    />
  )
}
