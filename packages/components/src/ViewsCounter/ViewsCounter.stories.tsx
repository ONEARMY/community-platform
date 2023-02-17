import { faker } from '@faker-js/faker'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ViewsCounter } from './ViewsCounter'

export default {
  title: 'Components/ViewsCounter',
  component: ViewsCounter,
} as ComponentMeta<typeof ViewsCounter>

export const Default: ComponentStory<typeof ViewsCounter> = () => (
  <ViewsCounter viewsCount={faker.datatype.number()} />
)

export const SingleView: ComponentStory<typeof ViewsCounter> = () => (
  <ViewsCounter viewsCount={1} />
)
