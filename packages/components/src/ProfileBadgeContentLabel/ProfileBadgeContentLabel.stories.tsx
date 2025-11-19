import { ProfileBadgeContentLabel } from './ProfileBadgeContentLabel';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/ProfileBadgeContentLabel',
  component: ProfileBadgeContentLabel,
} as Meta<typeof ProfileBadgeContentLabel>;

export const Default: StoryFn<typeof ProfileBadgeContentLabel> = () => {
  const profileBadge = {
    id: 1,
    name: 'prop',
    displayName: 'PRO',
    imageUrl:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/icons/pro.svg',
  };
  return <ProfileBadgeContentLabel profileBadge={profileBadge} />;
};
