import { ResponsiveCard } from './ResponsiveCard'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ResponsiveCard',
  component: ResponsiveCard,
} as Meta<typeof ResponsiveCard>

export const Default: StoryFn<typeof ResponsiveCard> = () => (
  <ResponsiveCard
    title="Title of the card"
    dataCy="test-id"
    dataId="card-id"
    link=""
    titleAs="h2"
  />
)
export const WithImage: StoryFn<typeof ResponsiveCard> = () => (
  <ResponsiveCard
    title="Title of the card"
    dataCy="test-id"
    dataId="card-id"
    link=""
    titleAs="h2"
    imageAlt="Image alt text"
    imageSrc="https://via.placeholder.com/92"
  />
)

export const WithImageAndCategory: StoryFn<typeof ResponsiveCard> = () => (
  <ResponsiveCard
    title="Title of the card"
    dataCy="test-id"
    dataId="card-id"
    link=""
    titleAs="h2"
    imageAlt="Image alt text"
    imageSrc="https://via.placeholder.com/92"
    category={{ label: 'Category' }}
  />
)

export const WithImageAndCategoryAndCounts: StoryFn<
  typeof ResponsiveCard
> = () => (
  <ResponsiveCard
    title="Title of the card"
    dataCy="test-id"
    dataId="card-id"
    link=""
    titleAs="h2"
    imageAlt="Image alt text"
    imageSrc="https://via.placeholder.com/92"
    category={{ label: 'Category' }}
    iconCounts={[
      {
        count: 1,
        icon: 'star-active',
        text: 'listing.usefulness',
      },
      {
        count: 1000000,
        icon: 'comment',
        text: 'listing.totalComments',
      },
    ]}
  />
)
