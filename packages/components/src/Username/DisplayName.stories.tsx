import { faker } from '@faker-js/faker';
import { DisplayName } from './DisplayName';
import type { Meta } from '@storybook/react-vite';
import type { Author } from 'oa-shared';

export default {
  title: 'Components/DisplayName',
  component: DisplayName,
} as Meta<typeof DisplayName>;

export const Default = {
  args: {
    user: {
      username: 'cool-maker',
      displayName: 'Cool Maker',
      country: 'de',
    } as Author,
  },
};

export const WithBadge = {
  args: {
    user: {
      username: 'pro-user',
      displayName: 'Pro User',
      country: 'nl',
      badges: [
        {
          id: 1,
          name: 'pro',
          displayName: 'PRO',
          imageUrl: faker.image.avatar(),
        },
      ],
    } as Author,
  },
};

export const WithMultipleBadges = {
  args: {
    user: {
      username: 'super-user',
      displayName: 'Super User',
      country: 'pt',
      badges: [
        {
          id: 1,
          name: 'pro',
          displayName: 'PRO',
          imageUrl: faker.image.avatar(),
        },
        {
          id: 2,
          name: 'supporter',
          displayName: 'Supporter',
          actionUrl: faker.internet.url(),
          imageUrl: faker.image.avatar(),
        },
      ],
    } as Author,
  },
};

export const UsernameOnly = {
  args: {
    user: {
      username: 'just-a-username',
    } as Author,
  },
};

export const NotALink = {
  args: {
    user: {
      username: 'static-user',
      displayName: 'Static User',
      country: 'fr',
    } as Author,
    isLink: false,
  },
};