import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ProfileListItem } from 'oa-shared';
import { ProfileList } from './profile-list';

const meta: Meta<typeof ProfileList> = {
  title: 'ui/ProfileList',
  component: ProfileList,
};
export default meta;

type Story = StoryObj<typeof ProfileList>;

const profiles: ProfileListItem[] = [
  {
    id: 1,
    username: 'test_user',
    displayName: 'Test User',
    photo: { id: '1', path: '', fullPath: '', publicUrl: faker.image.avatar() },
    country: 'pt',
    badges: [{ id: 1, name: 'pro', displayName: 'PRO', imageUrl: faker.image.avatar() }],
    type: null,
  },
  {
    id: 2,
    username: 'example_user',
    displayName: 'Example User',
    photo: null,
    country: 'UK',
    badges: [],
    type: null,
  },
];

export const Default: Story = {
  args: { header: 'Others that found it useful', profiles },
};

export const Empty: Story = {
  args: { header: 'Others that found it useful', profiles: [] },
};
