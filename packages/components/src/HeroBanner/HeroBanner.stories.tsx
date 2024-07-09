import { HeroBanner } from './HeroBanner'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/HeroBanner',
  component: HeroBanner,
} as Meta<typeof HeroBanner>

export const Celebration: StoryFn<typeof HeroBanner> = () => (
  <HeroBanner type="celebration" />
)

export const Email: StoryFn<typeof HeroBanner> = () => (
  <HeroBanner type="email" />
)
