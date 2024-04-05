import type { StoryFn, Meta } from '@storybook/react'
import { Breadcrumbs } from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
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
        text: "Category",
        link: '/questions?category=Category'
      },
      {
        text: "Are we real?",
      },
    ]}
  />
)

export const Shortened: StoryFn<typeof Breadcrumbs> = () => (
  <Breadcrumbs
    steps={[
      {
        text: 'Question',
        link: '/questions',
      },
      {
        text: "Very Long Category",
        link: '/questions?category=Very Long Category'
      },
      {
        text: "Are we real?",
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
        text: "Are we real?",
      },
    ]}
  />
)