import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  create: 'Publish',
  draft: { create: 'Save as draft', update: 'Save to draft' },
  edit: 'Update',
}

export const headings = {
  create: 'Add news',
  edit: 'Edit your news',
  list: 'Latest news from the community',
}

export const fields: ILabels = {
  category: {
    placeholder: 'Start typing to find the perfect category...',
    title: 'Which category fits your news?',
  },
  body: {
    placeholder:
      'Write and structure the body of your article. Markdown is also supported.',
    title: 'Body',
  },
  profileBadge: {
    title: 'Limit to badged users',
    placeholder: 'Select if this is for profiles with a certain profile badge',
  },
  summary: {
    title: 'Summary',
    description: 'What will show on the main page',
    placeholder: '180 characters max',
  },
  tags: {
    title: 'Select tags',
  },
  title: {
    title: 'Title',
  },
  heroImage: {
    title: 'Cover image',
    description:
      'This image should be landscape with 2:1 aspect ratio. We advise 1240x620px',
  },
}

export const listing = {
  create: 'Add news',
  filterCategory: 'Filter by category',
  incompleteProfile: 'Complete your profile to add news',
  join: 'Sign up to be able to add news',
  loadMore: 'Load More',
  loggedOut: 'Gotta log in please for the awesome power of news adding.',
  noNews: 'No new has been added yet',
  search: 'Search for news',
  sort: 'Sort by',
  totalComments: 'Total comments',
  usefulness: 'How useful it is',
}
