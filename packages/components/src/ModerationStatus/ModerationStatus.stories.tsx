import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ModerationStatus } from './ModerationStatus'

export default {
  title: 'Base Components/ModerationStatus',
  component: ModerationStatus,
} as ComponentMeta<typeof ModerationStatus>

export const Default: ComponentStory<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'draft'} />
)

export const Rejected: ComponentStory<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'rejected'} />
)
export const Awaiting: ComponentStory<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'event'} status={'awaiting-moderation'} />
)

export const HowtoDraft: ComponentStory<typeof ModerationStatus> = () => (
  <ModerationStatus contentType={'howto'} status={'draft'} />
)

export const Accepted: ComponentStory<typeof ModerationStatus> = () => (
  <>
    <ModerationStatus contentType={'event'} status={'accepted'} />
    The status text should not be shown.
  </>
)
