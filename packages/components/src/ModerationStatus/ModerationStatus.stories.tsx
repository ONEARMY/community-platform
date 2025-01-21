import { ModerationStatus } from './ModerationStatus'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ModerationStatus',
  component: ModerationStatus,
} as Meta<typeof ModerationStatus>

export const Default: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'draft'} />
)

export const Rejected: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'rejected'} />
)
export const Awaiting: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'awaiting-moderation'} />
)

export const HowtoDraft: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'library'} status={'draft'} />
)

export const Accepted: StoryFn<typeof ModerationStatus> = () => (
  <>
    <ModerationStatus contentType={'event'} status={'accepted'} />
    The status text should not be shown.
  </>
)
