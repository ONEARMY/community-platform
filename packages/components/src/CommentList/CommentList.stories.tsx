import { createFakeComments, fakeComment } from '../utils'
import { CommentList } from './CommentList'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/CommentList',
  component: CommentList,
} as Meta<typeof CommentList>

export const Default: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createFakeComments(2)}
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
    isLoggedIn={true}
    maxLength={1000}
    onMoreComments={() => null}
  />
)

export const Expandable: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createFakeComments(20)}
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
    isLoggedIn={true}
    maxLength={1000}
    onMoreComments={() => null}
  />
)

export const WithNestedComments: StoryFn<typeof CommentList> = () => {
  const comments = [
    fakeComment({
      replies: [fakeComment(), fakeComment()],
    }),
    fakeComment({
      replies: [fakeComment()],
    }),
    fakeComment(),
  ]

  return (
    <CommentList
      supportReplies={true}
      comments={comments}
      handleDelete={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      isLoggedIn={true}
      maxLength={1000}
      onMoreComments={() => Promise.resolve()}
      onSubmitReply={() => Promise.resolve()}
    />
  )
}

const highlightedCommentList = createFakeComments(20, { isEditable: false })

export const Highlighted: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={highlightedCommentList}
    highlightedCommentId={
      highlightedCommentList[highlightedCommentList.length - 2]._id
    }
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
    isLoggedIn={true}
    maxLength={1000}
    onMoreComments={() => null}
  />
)
