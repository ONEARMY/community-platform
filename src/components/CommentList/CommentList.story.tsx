import { CommentList } from './CommentList'
import type { Props } from './CommentList'
import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Comments/CommentList',
  component: CommentList,
} as ComponentMeta<typeof CommentList>

const Base: ComponentStory<typeof CommentList> = (args: Props) => (
  <CommentList {...args} />
)

export const Default = Base.bind({})
