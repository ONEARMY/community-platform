import { useState } from 'react'

import { createFakeComments } from '../utils'
import { DiscussionContainer } from './DiscussionContainer'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Discussions/DiscussionContainer',
  component: DiscussionContainer,
} as Meta<typeof DiscussionContainer>

const fakeComments = createFakeComments(3)
const expandableFakeComments = createFakeComments(15)

type Story = StoryObj<typeof DiscussionContainer> & {
  render: () => JSX.Element
}

export const Default: Story = {
  render: () => {
    return (
      <DiscussionContainer
        comment={''}
        comments={fakeComments}
        handleDelete={() => Promise.resolve()}
        handleEditRequest={() => Promise.resolve()}
        handleEdit={() => Promise.resolve()}
        maxLength={1000}
        onChange={() => null}
        onMoreComments={() => null}
        onSubmit={() => null}
        onSubmitReply={() => Promise.resolve()}
        isSubmitting={false}
        isLoggedIn={false}
      />
    )
  },
}

export const NoComments: Story = {
  render: () => {
    return (
      <DiscussionContainer
        comments={[]}
        handleDelete={() => Promise.resolve()}
        handleEditRequest={() => Promise.resolve()}
        handleEdit={() => Promise.resolve()}
        maxLength={1000}
        comment={''}
        onChange={() => null}
        onMoreComments={() => null}
        onSubmit={() => null}
        onSubmitReply={() => Promise.resolve()}
        isSubmitting={false}
        isLoggedIn={false}
      />
    )
  },
}

export const LoggedIn: Story = {
  render: () => {
    const [comment, setComment] = useState<string>('')

    return (
      <DiscussionContainer
        comments={fakeComments}
        handleDelete={() => Promise.resolve()}
        handleEditRequest={() => Promise.resolve()}
        handleEdit={() => Promise.resolve()}
        maxLength={1000}
        comment={comment}
        onChange={setComment}
        onMoreComments={() => null}
        onSubmit={() => null}
        onSubmitReply={() => Promise.resolve()}
        isSubmitting={false}
        isLoggedIn={true}
      />
    )
  },
}

export const Expandable: Story = {
  render: () => {
    const [comment, setComment] = useState<string>('')

    return (
      <DiscussionContainer
        comments={expandableFakeComments}
        handleDelete={() => Promise.resolve()}
        handleEditRequest={() => Promise.resolve()}
        handleEdit={() => Promise.resolve()}
        maxLength={1000}
        comment={comment}
        onChange={setComment}
        onMoreComments={() => null}
        onSubmit={() => null}
        onSubmitReply={() => Promise.resolve()}
        isSubmitting={false}
        isLoggedIn={true}
      />
    )
  },
}

export const WithReplies: Story = {
  render: () => {
    const [comment, setComment] = useState<string>('')

    const fakeComments = createFakeComments(3)
    fakeComments[0].replies = createFakeComments(2)

    return (
      <DiscussionContainer
        supportReplies={true}
        comments={fakeComments}
        handleDelete={() => Promise.resolve()}
        handleEditRequest={() => Promise.resolve()}
        handleEdit={() => Promise.resolve()}
        maxLength={1000}
        comment={comment}
        onChange={setComment}
        onMoreComments={() => null}
        onSubmit={() => null}
        isLoggedIn={true}
        isSubmitting={false}
        onSubmitReply={async (commentId, comment) =>
          alert(`reply to commentId: ${commentId} with comment: ${comment}`)
        }
      />
    )
  },
}
