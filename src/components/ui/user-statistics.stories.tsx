import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserStatistics } from './user-statistics';

const meta: Meta<typeof UserStatistics> = {
  title: 'ui/UserStatistics',
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
          imageUrl: faker.image.avatar(),
        },
        {
          id: 2,
          displayName: 'Supporter',
          name: 'supporter',
          actionUrl: faker.internet.url(),
          imageUrl: faker.image.avatar(),
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

export const WithoutViews: Story = {
  args: {
    ...Default.args,
    showViews: false,
  },
};

export const LocationOnly: Story = {
  args: {
    profile: {
      country: '',
      id: 1,
      badges: [],
      totalViews: 0,
      username: 'Test User',
    },
    pin: {
      country: '',
    },
    libraryCount: 0,
    usefulCount: 0,
    researchCount: 0,
    questionCount: 0,
    showViews: true,
  },
};
