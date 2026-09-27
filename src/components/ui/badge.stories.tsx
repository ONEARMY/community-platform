import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'ui/Badge',
  component: Badge,
  args: {
    children: 'accepted',
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'awaiting-moderation' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'improvements-needed' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'rejected' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Badge>default</Badge>
      <Badge variant="success">accepted</Badge>
      <Badge variant="warning">awaiting-moderation</Badge>
      <Badge variant="info">improvements-needed</Badge>
      <Badge variant="destructive">rejected</Badge>
    </div>
  ),
};
