import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileLink } from './profile-link';

const meta: Meta<typeof ProfileLink> = {
  title: 'ui/ProfileLink',
  component: ProfileLink,
};
export default meta;

type Story = StoryObj<typeof ProfileLink>;

export const Default: Story = {
  args: {
    url: 'https://example.com',
  },
};

export const LongUrl: Story = {
  args: {
    url: 'https://example.com/a/very/long/path/that/might/overflow/the/container/if/not/properly/broken',
  },
};
