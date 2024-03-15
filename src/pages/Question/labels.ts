import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  create: 'Publish',
  draft: { create: 'Save as draft', update: 'Save to draft' },
  edit: 'Update',
}

export const headings = {
  create: 'Ask your question to the community',
  edit: 'Edit your question to the community',
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
}
