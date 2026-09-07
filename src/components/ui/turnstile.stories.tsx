import type { Meta, StoryObj } from '@storybook/react-vite';
import { Turnstile, TURNSTILE_TEST_SITE_KEY } from './turnstile';

const meta: Meta<typeof Turnstile> = {
  title: 'ui/Turnstile',
  component: Turnstile,
  args: {
    siteKey: TURNSTILE_TEST_SITE_KEY,
    onVerify: (token: string) => console.log('verified', token),
  },
};
export default meta;

type Story = StoryObj<typeof Turnstile>;

export const Default: Story = {};
