import { fakePinProfile, fakeProfileType } from '../utils';
import { CardProfile } from './CardProfile';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { MapPin, PinProfile } from 'oa-shared';

export default {
  title: 'Components/CardProfile',
  component: CardProfile,
} as Meta<typeof CardProfile>;

const member: PinProfile = fakePinProfile();

const space: PinProfile = fakePinProfile({
  type: fakeProfileType({ isSpace: true }),
});

export const Member: StoryFn<typeof CardProfile> = () => (
  <CardProfile item={{ profile: member } as MapPin} />
);

export const Space: StoryFn<typeof CardProfile> = () => (
  <CardProfile item={{ profile: space } as MapPin} />
);
