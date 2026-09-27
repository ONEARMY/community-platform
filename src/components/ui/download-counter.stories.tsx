import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadCounter } from "@/components/ui/download-counter";

const meta: Meta<typeof DownloadCounter> = {
  title: 'ui/DownloadCounter',
  component: DownloadCounter
};
export default meta;

type Story = StoryObj<typeof DownloadCounter>;

export const Default: Story = { args: { total: 1888999 }};

export const One: Story = { args: { total: 1 }};

export const Zero: Story = { args: { total: 0 }};
