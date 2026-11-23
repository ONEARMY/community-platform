import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsefulButtonLite } from '@/components/ui/useful-button-lite';

const meta: Meta<typeof UsefulButtonLite> = {
  title: 'ui/UsefulButtonLite',
  component: UsefulButtonLite,
  args: {
    hasUserVotedUseful: false,
    votedUsefulCount: 5,
    isLoggedIn: true,
    onUsefulClick: async () => {},
  },
};
export default meta;

type Story = StoryObj<typeof UsefulButtonLite>;

export const Default: Story = {};

export const Voted: Story = { args: { hasUserVotedUseful: true } };

export const NoVotes: Story = { args: { votedUsefulCount: 0 } };

export const LoggedOut: Story = { args: { isLoggedIn: false } };
