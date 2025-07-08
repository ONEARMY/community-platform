import { CommentsTitle } from './CommentsTitle'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { Comment } from 'oa-shared'

export default {
  title: 'Commenting/CommentsTitle',
  component: CommentsTitle,
} as Meta<typeof CommentsTitle>

export const NoComments: StoryFn<typeof CommentsTitle> = () => (
  <CommentsTitle comments={[]} />
)

export const OneComment: StoryFn<typeof CommentsTitle> = () => {
  const comment = {} as Comment

  return <CommentsTitle comments={[comment]} />
}

export const MultipleComments: StoryFn<typeof CommentsTitle> = () => {
  const comment = {} as Comment
  return <CommentsTitle comments={[comment, comment, comment]} />
}
