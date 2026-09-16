import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteFooter } from './site-footer';

const meta: Meta<typeof SiteFooter> = {
  title: 'ui/SiteFooter',
  component: SiteFooter,
};
export default meta;

type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {
  args: { siteName: 'Precious Plastic' },
};

export const LongSiteName: Story = {
  args: { siteName: 'Project Kamp Community Platform' },
};
