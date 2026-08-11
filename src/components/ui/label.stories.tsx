import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'ui/Label',
  component: Label,
  args: {
    children: 'Label',
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
      <Label htmlFor="story-name">Name</Label>
      <Input id="story-name" placeholder="Category name" />
    </div>
  ),
};
