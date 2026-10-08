import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ColorInput } from './color-input';

const meta: Meta<typeof ColorInput> = {
  title: 'ui/ColorInput',
  component: ColorInput,
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <ColorInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    value: '#fee77b',
  },
};
export default meta;

type Story = StoryObj<typeof ColorInput>;

export const Default: Story = {};

export const ShortHex: Story = {
  args: { value: '#f0b' },
};

export const EmptyWithPlaceholder: Story = {
  args: { value: '', placeholder: '#fff0b4' },
};

export const Invalid: Story = {
  args: { value: 'not a colour', 'aria-invalid': true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
