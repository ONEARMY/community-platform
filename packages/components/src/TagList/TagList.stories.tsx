import { TagList } from './TagList'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/TagList',
  component: TagList,
} as Meta<typeof TagList>

export const Default: StoryFn<typeof TagList> = () => (
  <TagList
    tags={[
      {
        label: 'Tag 1',
      },
      {
        label: 'Tag 2',
      },
    ]}
  />
)
