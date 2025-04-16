import { NotificationListSupabase } from './NotificationListSupabase'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/NotificationListSupabase',
  component: NotificationListSupabase,
} as Meta<typeof NotificationListSupabase>

export const Default: StoryFn<typeof NotificationListSupabase> = () => (
  <NotificationListSupabase notifications={[]} />
)
