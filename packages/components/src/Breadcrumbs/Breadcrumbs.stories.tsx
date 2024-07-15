import { Breadcrumbs } from './Breadcrumbs'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>

export const Default: StoryFn<typeof Breadcrumbs> = () => (
  <Breadcrumbs
    steps={[
      {
        text: 'Question',
        link: '/questions',
      },
      {
        text: 'Category',
        link: '/questions?category=Category',
      },
      {
        text: 'Are we real?',
      },
    ]}
  />
)

export const NoCategory: StoryFn<typeof Breadcrumbs> = () => (
  <Breadcrumbs
    steps={[
      {
        text: 'Question',
        link: '/questions',
      },
      {
        text: 'Are we real?',
      },
    ]}
  />
)
