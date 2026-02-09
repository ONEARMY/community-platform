import { FollowButton } from './FollowButton';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/FollowButton',
  component: FollowButton,
} as Meta<typeof FollowButton>;

export const LoggedOut: StoryFn<typeof FollowButton> = () => (
  <FollowButton isLoggedIn={false} isFollowing={false} onFollowClick={() => null} />
);

export const LoggedIn: StoryFn<typeof FollowButton> = () => (
  <FollowButton isLoggedIn={true} isFollowing={false} onFollowClick={() => null} />
);

export const CurrentUserSubscribed: StoryFn<typeof FollowButton> = () => (
  <FollowButton isLoggedIn={true} isFollowing={true} onFollowClick={() => null} />
);
