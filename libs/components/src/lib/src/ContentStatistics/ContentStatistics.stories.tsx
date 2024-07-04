import { faker } from '@faker-js/faker'

import { ContentStatistics } from './ContentStatistics'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ContentStatistics',
  component: ContentStatistics,
} as Meta<typeof ContentStatistics>

export const Default: StoryFn<typeof ContentStatistics> = () => (
  <ContentStatistics
    statistics={[
      {
        icon: 'view',
        label: `${faker.number.int()} views`,
      },
      {
        icon: 'star',
        label: `${faker.number.int()} useful`,
      },
      {
        icon: 'comment',
        label: `${faker.number.int()} comments`,
      },
      {
        icon: 'update',
        label: `${faker.number.int()} steps`,
      },
    ]}
  />
)

export const SingleCount: StoryFn<typeof ContentStatistics> = () => (
  <ContentStatistics
    statistics={[
      {
        icon: 'view',
        label: '1 view',
      },
      {
        icon: 'star',
        label: '1 useful',
      },
      {
        icon: 'comment',
        label: '1 comment',
      },
      {
        icon: 'update',
        label: '1 step',
      },
    ]}
  />
)
