import { UserStatistics } from './UserStatistics';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof UserStatistics> = {
  title: 'Layout/UserStatistics',
  component: UserStatistics,
};
export default meta;

type Story = StoryObj<typeof UserStatistics>;

export const Default: Story = {
  args: {
    profile: {
      country: 'Greenland',
      id: 1,
      badges: [
        {
          id: 1,
          displayName: 'PRO',
          name: 'pro',
          imageUrl: '',
        },
        {
          id: 2,
          displayName: 'Supporter',
          name: 'supporter',
          actionUrl: 'https://www.patreon.com/one_army',
          imageUrl: '',
        },
      ],
      totalViews: 23,
      username: 'Test User',
    },
    pin: {
      country: 'Greenland',
    },
    libraryCount: 10,
    usefulCount: 20,
    researchCount: 2,
  },
};