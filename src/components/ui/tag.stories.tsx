import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './tag';

const meta: Meta<typeof Tag> = {
  title: 'ui/Tag',
  component: Tag,
  args: {
    label: 'Label',
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {};
