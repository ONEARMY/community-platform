import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlagIcon } from './flag-icon';

const meta: Meta<typeof FlagIcon> = {
  title: 'ui/FlagIcon',
  component: FlagIcon,
  args: {
    countryCode: 'GB',
  },
};
export default meta;

type Story = StoryObj<typeof FlagIcon>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Countries: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <FlagIcon countryCode="GB" />
      <FlagIcon countryCode="NL" />
      <FlagIcon countryCode="BR" />
      <FlagIcon countryCode="JP" />
      <FlagIcon countryCode="ZA" />
    </div>
  ),
};
