import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { ContentStatistics } from './ContentStatistics'

export default {
  title: 'Components/ContentStatistics',
  component: ContentStatistics,
} as Meta<typeof ContentStatistics>

export const Default: StoryFn<typeof ContentStatistics> = () => (
  <ContentStatistics
    statistics={[
      {
        icon: 'view',
        label: `${faker.datatype.number()} views`,
      },
      {
        icon: 'star',
        label: `${faker.datatype.number()} useful`,
      },
      {
        icon: 'comment',
        label: `${faker.datatype.number()} comments`,
      },
      {
        icon: 'update',
        label: `${faker.datatype.number()} steps`,
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
