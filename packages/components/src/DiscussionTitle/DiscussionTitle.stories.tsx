import type { StoryFn, Meta } from '@storybook/react'
import { DiscussionTitle } from './DiscussionTitle'

export default {
  title: 'Components/DiscussionTitle',
  component: DiscussionTitle,
} as Meta<typeof DiscussionTitle>

export const NoComments: StoryFn<typeof DiscussionTitle> = () => (
  <DiscussionTitle length={0} />
)

export const OneComment: StoryFn<typeof DiscussionTitle> = () => (
  <DiscussionTitle length={1} />
)

export const MultipleComments: StoryFn<typeof DiscussionTitle> = () => (
  <DiscussionTitle length={45} />
)
