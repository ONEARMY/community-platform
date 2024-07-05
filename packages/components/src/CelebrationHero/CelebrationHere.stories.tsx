import { CelebrationHero } from './CelebrationHero'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/CelebrationHero',
  component: CelebrationHero,
} as Meta<typeof CelebrationHero>

export const Default: StoryFn<typeof CelebrationHero> = () => (
  <CelebrationHero />
)
