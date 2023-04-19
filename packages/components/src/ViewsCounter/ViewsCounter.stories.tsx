import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { ViewsCounter } from './ViewsCounter'

export default {
  title: 'Components/ViewsCounter',
  component: ViewsCounter,
} as Meta<typeof ViewsCounter>

export const Default: StoryFn<typeof ViewsCounter> = () => (
  <ViewsCounter viewsCount={faker.datatype.number()} />
)

export const SingleView: StoryFn<typeof ViewsCounter> = () => (
  <ViewsCounter viewsCount={1} />
)
