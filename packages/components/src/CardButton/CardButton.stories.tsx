import { CardButton } from './CardButton';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/CardButton',
  component: CardButton,
} as Meta<typeof CardButton>;

export const Basic: StoryFn<typeof CardButton> = () => (
  <div style={{ width: '300px' }}>
    <CardButton isSelected={false}>
      <div style={{ padding: '20px' }}>Basic Implementation</div>
    </CardButton>
  </div>
);
