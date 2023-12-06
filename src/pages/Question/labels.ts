import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  create: 'Publish',
  draft: { create: 'Save as draft', update: 'Save to draft' },
  edit: 'Update',
}

export const headings = {
  create: 'Ask your question',
  edit: 'Edit your question',
}

export const overview: ILabels = {
  question: {
    placeholder: 'How come … does not work?',
    title: 'The Question',
  },
  description: {
    placeholder:
      'Introduce to your research question. Mention what you want to do, whats the goal what challenges you see, etc',
    title: 'Give some more information',
  },
  tags: {
    title: 'Select tags',
  },
}
