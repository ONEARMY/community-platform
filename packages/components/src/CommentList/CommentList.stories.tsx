import { createFakeComments, fakeComment } from '../utils'
import { CommentList } from './CommentList'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Commenting/CommentList',
  component: CommentList,
} as Meta<typeof CommentList>

export const Default: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createFakeComments(2)}
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
    isLoggedIn={true}
    isReplies={false}
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
    isReplies={false}
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
      creatorImage:
        'https://oacpppprod-1fa0a.kxcdn.com/o/uploads%2Fhowtos%2FsEHCqVHlBmMRG8TG0CGN%2FToasteOvenMod-18cd7fc9c38.jpg?alt=media&token=1dd11c48-151a-49cc-9287-443f96a10840',
      replies: [
        fakeComment({
          creatorImage:
            'https://avatars.githubusercontent.com/u/16688508?s=80&u=7332d9d2a953c33179b428d2ee804bfc80a06f5d&v=4',
        }),
      ],
      _deleted: true,
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
      isReplies={false}
      maxLength={1000}
      onMoreComments={() => Promise.resolve()}
      onSubmitReply={() => Promise.resolve()}
    />
  )
}

export const WithNestedCommentsAndReplies: StoryFn<typeof CommentList> = () => {
  const comments = [
    fakeComment({
      replies: [fakeComment(), fakeComment()],
    }),
    fakeComment(),
    fakeComment(),
  ]

  return (
    <CommentList
      supportReplies={true}
      comments={comments}
      isLoggedIn={true}
      isReplies={false}
      maxLength={800}
      setCommentBeingRepliedTo={() => {}}
      handleDelete={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      onMoreComments={() => Promise.resolve()}
    />
  )
}

export const WithNestedCommentsAndRepliesMaxDepthTwo: StoryFn<
  typeof CommentList
> = () => {
  const comments = [
    fakeComment({
      replies: [
        fakeComment({
          replies: [fakeComment()],
        }),
      ],
    }),
  ]

  return (
    <CommentList
      supportReplies={true}
      isLoggedIn={true}
      isReplies={false}
      maxLength={800}
      comments={comments}
      setCommentBeingRepliedTo={() => {}}
      handleDelete={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      onMoreComments={() => Promise.resolve()}
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
    isReplies={false}
    maxLength={1000}
    onMoreComments={() => null}
  />
)
