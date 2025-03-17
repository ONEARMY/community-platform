import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  create: 'Publish',
  draft: { create: 'Save as draft', update: 'Save to draft' },
  edit: 'Update',
}

export const headings = {
  create: 'Ask your question to the community',
  edit: 'Edit your question to the community',
  list: 'Ask your questions and help others out',
}

export const fields: ILabels = {
  category: {
    placeholder: 'Start typing to find the perfect category...',
    title: 'Which category fits your question?',
  },
  description: {
    placeholder:
      'What information will help the community understand what you need help with?',
    title: 'Description',
  },
  tags: {
    title: 'Select tags',
  },
  title: {
    title: 'The Question',
    placeholder: 'So what do you need to know?',
  },
  images: {
    title: 'Upload image(s) for this question',
  },
}

export const listing = {
  create: 'Ask a question',
  filterCategory: 'Filter by category',
  incompleteProfile: 'Complete your profile to ask your question',
  join: 'Sign up to ask your question',
  loadMore: 'Load More',
  loggedOut: 'Gotta log in please for that sweet sweet question asking...',
  noQuestions: 'No questions have been asked yet',
  search: 'Search for questions',
  sort: 'Sort by',
  totalComments: 'Total comments',
  usefulness: 'How useful it is',
}
