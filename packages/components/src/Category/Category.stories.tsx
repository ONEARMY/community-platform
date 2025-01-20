import { Category } from './Category'

import type { Meta, StoryFn } from '@storybook/react'
import type { DBCategory } from 'oa-shared'

export default {
  title: 'Components/Category',
  component: Category,
} as Meta<typeof Category>

export const Default: StoryFn<typeof Category> = () => (
  <Category
    category={
      {
        name: 'Label',
      } as DBCategory
    }
  />
)
