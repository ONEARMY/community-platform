import { useState } from 'react'

import { createFakeComments } from '../utils'
import { ButtonShowReplies } from './ButtonShowReplies'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ButtonShowReplies',
  component: ButtonShowReplies,
} as Meta<typeof ButtonShowReplies>

export const Default: StoryFn<typeof ButtonShowReplies> = () => {
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false)

  const replies = createFakeComments(7)

  return (
    <ButtonShowReplies
      creatorName="Jeff"
      replies={replies}
      isShowReplies={isShowReplies}
      setIsShowReplies={() => setIsShowReplies(!isShowReplies)}
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
      setIsShowReplies={() => null}
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
      setIsShowReplies={() => null}
    />
  )
}

export const NoReplies: StoryFn<typeof ButtonShowReplies> = () => {
  return (
    <ButtonShowReplies
      creatorName="Link"
      isShowReplies={false}
      replies={[]}
      setIsShowReplies={() => null}
    />
  )
}
