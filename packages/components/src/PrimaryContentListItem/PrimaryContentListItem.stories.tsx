import { PrimaryContentListItem } from './PrimaryContentListItem'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ResponsiveCard',
  component: PrimaryContentListItem,
} as Meta<typeof PrimaryContentListItem>

export const Default: StoryFn<typeof PrimaryContentListItem> = () => (
  <PrimaryContentListItem title="Title of the card" dataCy="test-id" link="" />
)
export const WithImage: StoryFn<typeof PrimaryContentListItem> = () => (
  <PrimaryContentListItem
    title="Title of the card"
    dataCy="test-id"
    link=""
    imageAlt="Image alt text"
    imageSrc="https://via.placeholder.com/92"
  />
)

export const WithImageAndCategory: StoryFn<
  typeof PrimaryContentListItem
> = () => (
  <PrimaryContentListItem
    title="Title of the card"
    dataCy="test-id"
    link=""
    imageAlt="Image alt text"
    imageSrc="https://via.placeholder.com/92"
    category={{ label: 'Category' }}
  />
)

export const WithImageAndCategoryAndCounts: StoryFn<
  typeof PrimaryContentListItem
> = () => (
  <PrimaryContentListItem
    title="Title of the card"
    dataCy="test-id"
    link=""
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
