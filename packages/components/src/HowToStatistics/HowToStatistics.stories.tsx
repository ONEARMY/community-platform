import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { HowToStatistics } from './HowToStatistics'

export default {
  title: 'Components/HowToStatistics',
  component: HowToStatistics,
} as Meta<typeof HowToStatistics>

export const Default: StoryFn<typeof HowToStatistics> = () => (
  <HowToStatistics
    viewCount={faker.datatype.number()}
    followingCount={faker.datatype.number()}
    usefulCount={faker.datatype.number()}
    commentCount={faker.datatype.number()}
    stepCount={faker.datatype.number()}
  />
)

export const SingleCount: StoryFn<typeof HowToStatistics> = () => (
  <HowToStatistics
    viewCount={1}
    followingCount={faker.datatype.number()}
    usefulCount={faker.datatype.number()}
    commentCount={1}
    stepCount={1}
  />
)
