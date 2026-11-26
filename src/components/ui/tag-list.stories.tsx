import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagList } from './tag-list';

const meta: Meta<typeof TagList> = {
  title: 'ui/TagList',
  component: TagList,
  args: {
    tags: ['Tag 1', 'Tag 2'],
  },
};
export default meta;

type Story = StoryObj<typeof TagList>;

export const Default: Story = {};

export const ManyTags: Story = {
  args: {
    tags: ['plastic', 'recycling', 'injection', 'extrusion', 'sheetpress', 'shredder', 'workshop'],
  },
};
