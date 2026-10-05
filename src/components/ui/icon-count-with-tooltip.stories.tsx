import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconCountWithTooltip } from './icon-count-with-tooltip';

const meta: Meta<typeof IconCountWithTooltip> = {
  title: 'ui/IconCountWithTooltip',
  component: IconCountWithTooltip,
};
export default meta;

type Story = StoryObj<typeof IconCountWithTooltip>;

export const Default: Story = {
  args: { count: 345, icon: 'show', text: 'Number of Views' },
};

export const LargeCount: Story = {
  args: { count: 1500, icon: 'show', text: 'Number of Views' },
};

export const VeryLargeCount: Story = {
  args: { count: 2099999, icon: 'show', text: 'Number of Views' },
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <IconCountWithTooltip count={1200} icon="show" text="Views" />
      <IconCountWithTooltip count={42} icon="star-active" text="How useful is it" />
      <IconCountWithTooltip count={7} icon="comment" text="Total comments" />
      <IconCountWithTooltip count={3} icon="update" text="Amount of updates" />
    </div>
  ),
};
