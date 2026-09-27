import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'ui/Skeleton',
  component: Skeleton,
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton style={{ width: 240, height: 16 }} />,
};

export const Avatar: Story = {
  render: () => <Skeleton style={{ width: 40, height: 40, borderRadius: '9999px' }} />,
};

export const Card: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
      <Skeleton style={{ width: '100%', height: 120 }} />
      <Skeleton style={{ width: '80%', height: 14 }} />
      <Skeleton style={{ width: '60%', height: 14 }} />
    </div>
  ),
};
