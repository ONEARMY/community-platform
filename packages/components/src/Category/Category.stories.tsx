import { Category } from './Category'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Category',
  component: Category,
} as Meta<typeof Category>

export const Default: StoryFn<typeof Category> = () => (
  <Category
    category={{
      label: 'Label',
    }}
  />
)
