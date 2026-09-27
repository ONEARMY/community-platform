import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'ui/Avatar',
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/does-not-exist.png" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {['size-6', 'size-8', 'size-12', 'size-16'].map((size) => (
        <Avatar key={size} className={size}>
          <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Ada Lovelace" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <Avatar shape="rounded" className="size-16">
      <AvatarImage src="https://picsum.photos/seed/news/80" alt="News hero" />
      <AvatarFallback>NW</AvatarFallback>
    </Avatar>
  ),
};
