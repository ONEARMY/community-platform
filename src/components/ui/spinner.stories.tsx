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

export const WithMessage: Story = {
  render: () => <Spinner label="Loading..." />,
};
