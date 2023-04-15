import { Loader } from './Loader'
import type { StoryFn, Meta } from '@storybook/react'

export default {
  title: 'Components/Loader',
  component: Loader,
} as Meta<typeof Loader>

export const Default: StoryFn<typeof Loader> = () => <Loader />
