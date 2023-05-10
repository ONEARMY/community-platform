import type { Meta, StoryFn } from '@storybook/react'
import { CategoryTag } from './CategoryTag'

export default {
  title: 'Components/CategoryTag',
  component: CategoryTag,
} as Meta<typeof CategoryTag>

export const Default: StoryFn<typeof CategoryTag> = () => (
  <CategoryTag
    tag={{
      label: 'Label',
    }}
  />
)
