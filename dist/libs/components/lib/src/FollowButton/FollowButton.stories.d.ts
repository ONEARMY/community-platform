import { Meta, StoryFn } from '@storybook/react';
import { FollowButton } from './FollowButton';

declare const _default: Meta<typeof FollowButton>;
export default _default;
export declare const LoggedOut: StoryFn<typeof FollowButton>;
export declare const LoggedIn: StoryFn<typeof FollowButton>;
export declare const CurrentUserSubscribed: StoryFn<typeof FollowButton>;
