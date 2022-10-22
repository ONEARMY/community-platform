import { Loader } from './Loader'
import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Components/Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>

export const Default: ComponentStory<typeof Loader> = () => <Loader />
