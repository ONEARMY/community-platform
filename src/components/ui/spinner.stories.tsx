import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'ui/Spinner',
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Large: Story = {
  render: () => <Spinner className="size-8" />,
};

export const WithMessage: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-2">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  ),
};
