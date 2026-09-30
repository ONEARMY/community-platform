import { UserStatistics } from './user-statistics';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof UserStatistics> = {
  title: 'ui/UserStatistics',
  component: UserStatistics,
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof UserStatistics>;

export const Default: Story = {
  args: {
    profile: {
      country: 'Greenland',
      id: 1 as any,
      badges: [
        {
          id: 1 as any,
          displayName: 'PRO',
          name: 'pro',
          imageUrl: '',
        },
        {
          id: 2 as any,
          displayName: 'Supporter',
          name: 'supporter',
          actionUrl: 'should_be_a_url',
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
    questionCount: 5,
    showViews: true,
  },
};
