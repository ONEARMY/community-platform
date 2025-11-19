import { Textarea } from 'theme-ui';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Forms/Textarea',
  component: Textarea,
} as Meta<typeof Textarea>;

export const Default: StoryFn<typeof Textarea> = () => (
  <Textarea placeholder="A short placeholder" />
);
