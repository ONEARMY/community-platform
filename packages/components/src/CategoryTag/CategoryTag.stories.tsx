import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { CategoryTag } from './CategoryTag'

export default {
  title: 'Components/CategoryTag',
  component: CategoryTag,
} as ComponentMeta<typeof CategoryTag>

export const Default: ComponentStory<typeof CategoryTag> = () => (
  <CategoryTag
    tag={{
      label: 'Label',
    }}
  />
)
