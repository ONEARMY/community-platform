import { HeroBanner } from './HeroBanner';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/HeroBanner',
  component: HeroBanner,
} as Meta<typeof HeroBanner>;

export const Celebration: StoryFn<typeof HeroBanner> = () => <HeroBanner type="celebration" />;

export const Email: StoryFn<typeof HeroBanner> = () => <HeroBanner type="email" />;
