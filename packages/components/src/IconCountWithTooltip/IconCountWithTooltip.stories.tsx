import { IconCountWithTooltip } from './IconCountWithTooltip';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/IconCountWithTooltip',
  component: IconCountWithTooltip,
} as Meta<typeof IconCountWithTooltip>;

export const Default: StoryFn<typeof IconCountWithTooltip> = () => (
  <IconCountWithTooltip count={345} icon="show" text="Number of Views" />
);

export const LargeCount: StoryFn<typeof IconCountWithTooltip> = () => (
  <IconCountWithTooltip count={1500} icon="show" text="Number of Views" />
);

export const VeryLargeCount: StoryFn<typeof IconCountWithTooltip> = () => (
  <IconCountWithTooltip count={2099999} icon="show" text="Number of Views" />
);
