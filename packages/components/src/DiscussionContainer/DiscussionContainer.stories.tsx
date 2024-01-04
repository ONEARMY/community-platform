import { useState } from 'react'

import { createFakeComments } from '../utils'
import { DiscussionContainer } from './DiscussionContainer'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/DiscussionContainer',
  component: DiscussionContainer,
} as Meta<typeof DiscussionContainer>

const fakeComments = createFakeComments(3)
const expandableFakeComments = createFakeComments(15)

export const Default: StoryFn<typeof DiscussionContainer> = () => {
  return (
    <DiscussionContainer
      comments={fakeComments}
      handleDelete={() => Promise.resolve()}
      handleEditRequest={() => Promise.resolve()}
      handleEdit={() => Promise.resolve()}
      maxLength={1000}
      comment={''}
      onChange={() => null}
      onMoreComments={() => null}
      onSubmit={() => null}
      isLoggedIn={false}
    />
  )
}

export const NoComments: StoryFn<typeof DiscussionContainer> = () => {
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
      isLoggedIn={false}
    />
  )
}

export const LoggedIn: StoryFn<typeof DiscussionContainer> = () => {
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
      isLoggedIn={true}
    />
  )
}

export const Expandable: StoryFn<typeof DiscussionContainer> = () => {
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
      isLoggedIn={true}
    />
  )
}
