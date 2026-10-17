import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Author } from 'oa-shared';
import { Username } from './username';

const meta: Meta<typeof Username> = {
  title: 'ui/Username',
  component: Username,
};
export default meta;

type Story = StoryObj<typeof Username>;

const proBadge = { id: 1, name: 'pro', displayName: 'PRO', imageUrl: faker.image.avatar() };
const supporterBadge = {
  id: 2,
  name: 'supporter',
  displayName: 'Supporter',
  actionUrl: faker.internet.url(),
  imageUrl: faker.image.avatar(),
};

export const NoBadge: Story = {
  args: {
    user: { username: 'a-username', country: 'pt' } as Author,
  },
};

export const OneBadge: Story = {
  args: {
    user: { username: 'a-username', country: 'pt', badges: [proBadge] } as Author,
  },
};

export const TwoBadges: Story = {
  args: {
    user: { username: 'a-username', country: 'pt', badges: [proBadge, supporterBadge] } as Author,
  },
};

export const WithoutFlag: Story = {
  args: {
    user: { username: 'a-username' } as Author,
  },
};

export const InvalidCountryCode: Story = {
  args: {
    user: { username: 'a-username', country: 'zz' } as Author,
  },
};

export const NotALink: Story = {
  args: {
    user: { username: 'a-username', country: 'pt' } as Author,
    isLink: false,
  },
};

export const WithAvatar: Story = {
  args: {
    user: {
      username: 'a-username',
      displayName: 'A Username',
      country: 'pt',
      badges: [proBadge],
      photo: { id: '1', publicUrl: faker.image.avatar() },
    } as Author,
    showAvatar: true,
  },
};

export const Inline: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Username user={{ username: 'a-username', country: 'pt' } as Author} variant="inline" />
      <span className="text-sm text-muted-foreground">beside inline text</span>
    </div>
  ),
};
