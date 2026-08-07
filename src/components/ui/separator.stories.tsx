import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'ui/Separator',
  component: Separator,
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <p style={{ fontSize: 14 }}>Above</p>
      <Separator style={{ margin: '12px 0' }} />
      <p style={{ fontSize: 14 }}>Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: 32, gap: 12 }}>
      <span style={{ fontSize: 14 }}>Left</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: 14 }}>Right</span>
    </div>
  ),
};
