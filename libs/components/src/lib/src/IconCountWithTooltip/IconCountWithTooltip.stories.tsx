import { IconCountWithTooltip } from './IconCountWithTooltip'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/IconCountWithTooltip',
  component: IconCountWithTooltip,
} as Meta<typeof IconCountWithTooltip>

export const Default: StoryFn<typeof IconCountWithTooltip> = () => (
  <IconCountWithTooltip count={3} icon="comment" text="Number of comments" />
)
