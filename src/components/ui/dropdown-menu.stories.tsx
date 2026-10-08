import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from 'oa-components';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import MoreVertIcon from './icons/more-vert.svg?react';

const meta: Meta<typeof DropdownMenu> = {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
        <MoreVertIcon aria-hidden="true" className="size-3" />
        <span className="sr-only">Show Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Icon aria-hidden="true" glyph="thunderbolt-grey" />
          Follow replies
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon aria-hidden="true" glyph="edit" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon aria-hidden="true" glyph="copy-link" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon aria-hidden="true" glyph="delete" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {};

export const Expanded: Story = {
  args: { defaultOpen: true },
};

export const Compact: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
        <MoreVertIcon aria-hidden="true" className="size-3" />
        <span className="sr-only">Show Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-34">
        <DropdownMenuItem size="default">
          <Icon aria-hidden="true" glyph="edit" size={18} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem size="default">
          <Icon aria-hidden="true" glyph="delete" size={18} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DisabledAction: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
        <MoreVertIcon aria-hidden="true" className="size-3" />
        <span className="sr-only">Show Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Unmark as accepted answer</DropdownMenuItem>
        <DropdownMenuItem disabled>Mark as accepted answer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
