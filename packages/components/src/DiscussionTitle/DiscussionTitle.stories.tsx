import { DiscussionTitle } from './DiscussionTitle'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { Comment } from 'oa-shared'

export default {
  title: 'Commenting/DiscussionTitle',
  component: DiscussionTitle,
} as Meta<typeof DiscussionTitle>

export const NoComments: StoryFn<typeof DiscussionTitle> = () => (
  <DiscussionTitle comments={[]} />
)

export const OneComment: StoryFn<typeof DiscussionTitle> = () => {
  const comment = {} as Comment

  return <DiscussionTitle comments={[comment]} />
}

export const MultipleComments: StoryFn<typeof DiscussionTitle> = () => {
  const comment = {} as Comment
  return <DiscussionTitle comments={[comment, comment, comment]} />
}
