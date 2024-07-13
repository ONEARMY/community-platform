import { IconCountGroup } from './IconCountGroup'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/IconCountGroup',
  component: IconCountGroup,
} as Meta<typeof IconCountGroup>

export const Default: StoryFn<typeof IconCountGroup> = () => (
  <IconCountGroup
    iconCounts={[
      {
        count: 0,
        icon: 'star-active',
        text: 'How useful is it',
      },
      {
        count: 1999999999,
        icon: 'comment',
        text: 'Total comments',
      },
      {
        count: 999999999,
        icon: 'update',
        text: 'Amount of updates',
        dataCy: 'ItemUpdateText',
      },
    ]}
  />
)
