import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterCount } from '@/components/ui/character-count';

const meta: Meta<typeof CharacterCount> = {
  title: 'ui/CharacterCount',
  component: CharacterCount,
};
export default meta;

type Story = StoryObj<typeof CharacterCount>;

export const Default: Story = { args: { current: 0, max: 100 } };

export const PartiallyFilled: Story = { args: { current: 50, max: 100 } };

export const AtLimit: Story = { args: { current: 100, max: 100 } };

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
      <CharacterCount current={0} max={100} />
      <CharacterCount current={50} max={100} />
      <CharacterCount current={100} max={100} />
    </div>
  ),
};
