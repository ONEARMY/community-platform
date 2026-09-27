import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'ui/Input',
  component: Input,
  args: {
    placeholder: 'Type something...',
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'Precious Plastic' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit this' },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Invalid value' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com' },
};
