import { CreateReply } from './CreateReply'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Discussions/CreateReply',
  component: CreateReply,
} as Meta<typeof CreateReply>

export const Default: StoryFn<typeof CreateReply> = () => {
  return (
    <CreateReply
      commentId={'23543bh'}
      isLoggedIn={false}
      maxLength={75}
      onSubmit={() => Promise.resolve()}
    />
  )
}

export const LoggedIn: StoryFn<typeof CreateReply> = () => {
  return (
    <CreateReply
      commentId={'23543bh'}
      isLoggedIn={true}
      maxLength={1000}
      onSubmit={() => Promise.resolve()}
    />
  )
}

export const LoggedInWithError: StoryFn<typeof CreateReply> = () => {
  return (
    <CreateReply
      commentId={'23543bh'}
      isLoggedIn={true}
      maxLength={1000}
      onSubmit={async () => {
        return Promise.reject(new Error('Error!'))
      }}
    />
  )
}
