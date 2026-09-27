import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'ui/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Write a description...',
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'A short description of this category.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit this' },
};
