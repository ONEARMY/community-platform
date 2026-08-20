import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta: Meta<typeof Sheet> = {
  title: 'ui/Sheet',
  component: Sheet,
};
export default meta;

type Story = StoryObj<typeof Sheet>;

function SheetDemo(side: 'top' | 'right' | 'bottom' | 'left') {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open from {side}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit category</SheetTitle>
          <SheetDescription>Make changes to this category, then save.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="button">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Right: Story = {
  render: () => SheetDemo('right'),
};

export const Left: Story = {
  render: () => SheetDemo('left'),
};

export const Top: Story = {
  render: () => SheetDemo('top'),
};

export const Bottom: Story = {
  render: () => SheetDemo('bottom'),
};
