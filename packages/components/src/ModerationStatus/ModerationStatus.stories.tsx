import { ModerationStatus } from './ModerationStatus'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/ModerationStatus',
  component: ModerationStatus,
} as Meta<typeof ModerationStatus>

export const Accepted: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus status="accepted" />
)

export const AwaitingModeration: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus status="awaiting-moderation" />
)
export const ImprovementsNeeded: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus status="improvements-needed" />
)
export const Rejected: StoryFn<typeof ModerationStatus> = () => (
  <ModerationStatus status="rejected" />
)
