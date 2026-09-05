import type { Meta, StoryObj } from '@storybook/react-vite';
import { Turnstile } from './turnstile';

// Cloudflare's published test sitekey that always passes without interaction
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const TEST_SITE_KEY = '1x00000000000000000000AA';

const meta: Meta<typeof Turnstile> = {
  title: 'ui/Turnstile',
  component: Turnstile,
  args: {
    siteKey: TEST_SITE_KEY,
    onVerify: (token: string) => console.log('verified', token),
  },
};
export default meta;

type Story = StoryObj<typeof Turnstile>;

export const Default: Story = {};
