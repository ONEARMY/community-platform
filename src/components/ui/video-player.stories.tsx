import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from './video-player';

const meta: Meta<typeof VideoPlayer> = {
  title: 'ui/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Youtube: Story = {
  render: () => (
    <div className="w-120 max-w-full">
      <VideoPlayer videoUrl="https://www.youtube.com/watch?v=anqfVCLRQHE" />
    </div>
  ),
};

export const Vimeo: Story = {
  render: () => (
    <div className="w-120 max-w-full">
      <VideoPlayer videoUrl="https://vimeo.com/492811707" />
    </div>
  ),
};

export const SquareRatio: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <VideoPlayer
        aspectRatio="square"
        videoUrl="https://www.youtube.com/watch?v=anqfVCLRQHE"
      />
    </div>
  ),
};
