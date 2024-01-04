import { CommentList } from './CommentList'
import { createFakeComments, fakeComment } from './createFakeComments'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/CommentList',
  component: CommentList,
} as Meta<typeof CommentList>

export const Default: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createFakeComments(2)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

export const Expandable: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createFakeComments(20)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

export const WithNestedComments: StoryFn<typeof CommentList> = () => {
  // TODO: This is a temporary solution to get nested comments to pass type check
  const comments: any = [
    fakeComment({
      replies: [fakeComment(), fakeComment()],
    }),
    fakeComment(),
    fakeComment(),
  ]

  return (
    <CommentList
      comments={comments}
      articleTitle="Test article"
      handleDelete={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
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
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)
