import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta: Meta<typeof Checkbox> = {
  title: 'ui/Checkbox',
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true },
};

export const WithLabel: Story = {
  render: () => (
    <Label htmlFor="story-consent" style={{ alignItems: 'flex-start', fontWeight: 400 }}>
      <Checkbox id="story-consent" />
      <span style={{ fontSize: 14 }}>I agree to the Terms of Service and Privacy Policy</span>
    </Label>
  ),
};
