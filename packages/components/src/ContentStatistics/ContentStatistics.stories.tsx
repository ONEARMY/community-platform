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
        label: `${faker.datatype.number()} views`,
        stat: faker.datatype.number(),
      },
      {
        icon: 'star',
        label: `${faker.datatype.number()} useful`,
        stat: faker.datatype.number(),
      },
      {
        icon: 'comment',
        label: `${faker.datatype.number()} comments`,
        stat: faker.datatype.number(),
      },
      {
        icon: 'update',
        label: `${faker.datatype.number()} steps`,
        stat: faker.datatype.number(),
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
