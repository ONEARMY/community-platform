import { faker } from '@faker-js/faker';

import { ContentStatistics } from './ContentStatistics';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/ContentStatistics',
  component: ContentStatistics,
} as Meta<typeof ContentStatistics>;

export const Default: StoryFn<typeof ContentStatistics> = () => (
  <ContentStatistics
    statistics={[
      {
        icon: 'show',
        label: `${faker.number.int()} views`,
        stat: faker.number.int(),
      },
      {
        icon: 'star',
        label: `${faker.number.int()} useful`,
        stat: faker.number.int(),
      },
      {
        icon: 'comment',
        label: `${faker.number.int()} comments`,
        stat: faker.number.int(),
      },
      {
        icon: 'update',
        label: `${faker.number.int()} steps`,
        stat: faker.number.int(),
      },
    ]}
  />
);

export const SingleCount: StoryFn<typeof ContentStatistics> = () => (
  <ContentStatistics
    statistics={[
      {
        icon: 'show',
        label: '1 view',
        stat: 1,
      },
      {
        icon: 'star',
        label: '1 useful',
        stat: 1,
      },
      {
        icon: 'comment',
        label: '1 comment',
        stat: 1,
      },
      {
        icon: 'update',
        label: '1 step',
        stat: 1,
      },
    ]}
  />
);
