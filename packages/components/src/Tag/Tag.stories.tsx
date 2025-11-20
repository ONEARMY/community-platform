import { Tag } from './Tag';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/Tag',
  component: Tag,
} as Meta<typeof Tag>;

export const Default: StoryFn<typeof Tag> = () => (
  <Tag
    tag={{
      label: 'Label',
    }}
  />
);
