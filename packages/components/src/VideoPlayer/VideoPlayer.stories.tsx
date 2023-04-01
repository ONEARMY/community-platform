import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { VideoPlayer } from './VideoPlayer'

export default {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
} as ComponentMeta<typeof VideoPlayer>

const Template: ComponentStory<typeof VideoPlayer> = (args) => (
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
