import type { StoryFn, Meta } from '@storybook/react'
import { CommentList } from './CommentList'
import { createComments } from './createComments'

export default {
  title: 'Components/CommentList',
  component: CommentList,
} as Meta<typeof CommentList>

export const Default: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createComments(2)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

export const Expandable: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createComments(20)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

const highlightedCommentList = createComments(20, { isEditable: false })

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
