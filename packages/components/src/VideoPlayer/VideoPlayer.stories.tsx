import { VideoPlayer } from './VideoPlayer'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
} as Meta<typeof VideoPlayer>

const Template: StoryFn<typeof VideoPlayer> = (args) => (
  <VideoPlayer {...args} />
)

export const Youtube = Template.bind({})
Youtube.args = {
  videoUrl: 'https://www.youtube.com/watch?v=anqfVCLRQHE',
}

export const Vimeo = Template.bind({})
Vimeo.args = {
  videoUrl: 'https://vimeo.com/492811707',
}
