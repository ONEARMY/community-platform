import { ProfileList } from './ProfileList';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { ProfileListItem } from 'oa-shared';

export default {
  title: 'Components/ProfileList',
  component: ProfileList,
} as Meta<typeof ProfileList>;

const mockProfiles: ProfileListItem[] = [
  {
    id: 1,
    username: 'test_user',
    displayName: 'Test User',
    photo: null,
    country: 'USA',
    badges: [],
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

export const Default: StoryFn<typeof ProfileList> = () => (
  <ProfileList profiles={mockProfiles} header="Profile List" />
);
