import type { StoryFn, Meta } from '@storybook/react'
import { CreateReply } from './CreateReply'

export default {
  title: 'Components/CreateReply',
  component: CreateReply,
} as Meta<typeof CreateReply>

export const Default: StoryFn<typeof CreateReply> = () => <CreateReply />
