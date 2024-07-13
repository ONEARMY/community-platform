import { ResponsiveCard } from './ResponsiveCard'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ResponsiveCard',
  component: ResponsiveCard,
} as Meta<typeof ResponsiveCard>

export const Default: StoryFn<typeof ResponsiveCard> = () => <ResponsiveCard />
