import { Loader } from './Loader'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Loader',
  component: Loader,
} as Meta<typeof Loader>

export const Default: StoryFn<typeof Loader> = () => <Loader />

export const CustomMessage: StoryFn<typeof Loader> = () => (
  <Loader label="Whatever you want to say! OMG!" />
)
