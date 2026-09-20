import type { Meta, StoryObj } from '@storybook/react-vite';
import { DisplayDate } from './display-date';

const meta: Meta<typeof DisplayDate> = {
  title: 'ui/DisplayDate',
  component: DisplayDate,
};
export default meta;

type Story = StoryObj<typeof DisplayDate>;

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

export const Default: Story = {
  args: { createdAt: minutesAgo(30) },
};

export const WithoutLabel: Story = {
  args: { createdAt: minutesAgo(30), showLabel: false },
};

export const Published: Story = {
  args: { createdAt: minutesAgo(60 * 48), publishedAt: minutesAgo(90) },
};

export const Asked: Story = {
  args: { createdAt: minutesAgo(90), publishedAt: minutesAgo(90), publishedAction: 'Asked' },
};

export const Edited: Story = {
  args: { createdAt: minutesAgo(60 * 24 * 9), modifiedAt: minutesAgo(45) },
};

/** Hover any row for the exact timestamp; narrow the viewport below `md` for the short form. */
export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
      {[0.5, 5, 90, 60 * 30, 60 * 24 * 9, 60 * 24 * 60, 60 * 24 * 500].map((minutes) => (
        <DisplayDate key={minutes} createdAt={minutesAgo(minutes)} showLabel={false} />
      ))}
    </div>
  ),
};
