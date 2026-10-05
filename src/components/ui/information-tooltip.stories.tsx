import type { Meta, StoryObj } from '@storybook/react-vite';
import { InformationTooltip } from './information-tooltip';

const meta: Meta<typeof InformationTooltip> = {
  title: 'ui/InformationTooltip',
  component: InformationTooltip,
};
export default meta;

type Story = StoryObj<typeof InformationTooltip>;

export const Default: Story = {
  args: { tooltip: "Afraid we've got to send these to you, so you can't opt-out." },
};

export const LongText: Story = {
  args: {
    tooltip:
      'A much longer piece of information that should wrap onto several lines instead of overflowing the edge of the screen.',
  },
};
