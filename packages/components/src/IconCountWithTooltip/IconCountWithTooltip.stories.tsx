import type { StoryFn, Meta } from '@storybook/react'
import { IconCountWithTooltip } from './IconCountWithTooltip'

export default {
  title: 'Components/IconCountWithTooltip',
  component: IconCountWithTooltip,
} as Meta<typeof IconCountWithTooltip>

export const Default: StoryFn<typeof IconCountWithTooltip> = () => (
  <IconCountWithTooltip count={3} icon="comment" text="Number of comments" />
)
