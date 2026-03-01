import { VideoPlayer } from './VideoPlayer';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
};
export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Youtube: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=anqfVCLRQHE',
  },
};

export const Vimeo: Story = {
  args: {
    videoUrl: 'https://vimeo.com/492811707',
  },
};