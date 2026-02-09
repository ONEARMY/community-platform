import { FollowIcon } from './FollowIcon';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/FollowIcon',
  component: FollowIcon,
} as Meta<typeof FollowIcon>;

export const FollowingReplies: StoryFn<typeof FollowIcon> = () => <FollowIcon tooltip="Following replies" />;
export const FollowingUpdates: StoryFn<typeof FollowIcon> = () => <FollowIcon tooltip="Following updates" />;
