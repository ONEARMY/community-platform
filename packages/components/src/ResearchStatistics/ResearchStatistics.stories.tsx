import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { ResearchStatistics } from './ResearchStatistics'

export default {
  title: 'Components/ResearchStatistics',
  component: ResearchStatistics,
} as Meta<typeof ResearchStatistics>

export const Default: StoryFn<typeof ResearchStatistics> = () => (
  <ResearchStatistics
    viewCount={faker.datatype.number()}
    followingCount={faker.datatype.number()}
    usefulCount={faker.datatype.number()}
    commentCount={faker.datatype.number()}
    updateCount={faker.datatype.number()}
  />
)

export const SingleCount: StoryFn<typeof ResearchStatistics> = () => (
  <ResearchStatistics
    viewCount={1}
    followingCount={faker.datatype.number()}
    usefulCount={faker.datatype.number()}
    commentCount={1}
    updateCount={1}
  />
)
