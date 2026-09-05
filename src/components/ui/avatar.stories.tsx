import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'ui/Avatar',
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="Ada Lovelace" src="https://i.pravatar.cc/64?img=5" />
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  ),
};

// A broken src must still leave something in the layout rather than a gap.
export const BrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="Ada Lovelace" src="https://example.invalid/missing.png" />
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar className="size-[25px]">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// How the research contributor row stacks them.
export const Stacked: Story = {
  render: () => (
    <div style={{ display: 'flex' }} className="-space-x-2">
      {['A', 'B', 'C'].map((initial) => (
        <Avatar className="size-[25px] ring-2 ring-background" key={initial}>
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
