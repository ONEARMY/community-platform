import type { Meta, StoryObj } from '@storybook/react';
import { CharacterCount } from './character-count';

const meta = {
  title: 'Components / CharacterCount',
  component: CharacterCount,
  // Relative container so the absolute positioning works in Storybook
  decorators: [
    (Story) => (
      <div className="relative w-full max-w-sm h-16 border border-dashed border-muted p-4 mt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CharacterCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentSize: 0,
    maxSize: 100,
    minSize: 0,
  },
};

export const NearingLimit: Story = {
  args: {
    currentSize: 91,
    maxSize: 100,
    minSize: 0,
  },
};

export const Warning: Story = {
  args: {
    currentSize: 96,
    maxSize: 100,
    minSize: 0,
  },
};

export const Error: Story = {
  args: {
    currentSize: 100,
    maxSize: 100,
    minSize: 0,
  },
};

export const BelowMinimum: Story = {
  args: {
    currentSize: 5,
    maxSize: 100,
    minSize: 10,
  },
};
