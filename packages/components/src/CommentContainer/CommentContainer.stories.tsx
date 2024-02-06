import { fakeComment } from '../utils'
import { CommentContainer } from './CommentContainer'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/CommentList/CommentContainer',
  component: CommentContainer,
} as Meta<typeof CommentContainer>

export const Default: StoryFn<typeof CommentContainer> = () => {
  const comment = fakeComment()

  return (
    <CommentContainer
      supportReplies={false}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      isLoggedIn={true}
      maxLength={100}
    />
  )
}

export const WithReplies: StoryFn<typeof CommentContainer> = () => {
  const reply = fakeComment()
  const comment = fakeComment({ replies: [reply] })

  return (
    <CommentContainer
      supportReplies={true}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      isLoggedIn={true}
      maxLength={100}
    />
  )
}

export const WithLotsReplies: StoryFn<typeof CommentContainer> = () => {
  const replies = Array(15).fill(0).map(fakeComment)
  const comment = fakeComment({ replies })

  return (
    <CommentContainer
      supportReplies={true}
      comment={comment}
      handleDelete={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      isLoggedIn={true}
      maxLength={100}
    />
  )
}
