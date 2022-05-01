import { CommentHeading } from './CommentHeading'
import type { Props } from './CommentHeading'
import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Comments/CommentHeading',
  component: CommentHeading,
} as ComponentMeta<typeof CommentHeading>

const Base: ComponentStory<typeof CommentHeading> = (args: Props) => (
  <CommentHeading {...args} />
)

export const Default = Base.bind({})

Default.args = {
  creatorCountry: 'nl',
  creatorName: 'Wim',
  isUserVerified: false,
  _edited: new Date().toLocaleDateString('en-GB'),
  _created: new Date().toLocaleDateString('en-GB'),
}
