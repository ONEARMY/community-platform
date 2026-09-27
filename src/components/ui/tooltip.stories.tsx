import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'ui/Tooltip',
  component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Add a new category</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div style={{ display: 'flex', gap: 24 }}>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>{side}</TooltipTrigger>
            <TooltipContent side={side}>On the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
