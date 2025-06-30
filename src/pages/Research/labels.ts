import { RESEARCH_MAX_LENGTH, RESEARCH_TITLE_MAX_LENGTH } from './constants'

import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  draft: 'Save as draft',
  markCompleted: 'Mark as Completed',
  markInProgress: 'Mark as In Progress',
  deletion: {
    text: 'Delete this update',
    confirm: 'Delete',
    message: 'Are you sure you want to delete this update?',
  },
  files: 'Re-upload files (this will delete the existing ones)',
  publish: 'Publish',
}

export const headings = {
  overview: {
    create: 'Start your Research',
    edit: 'Edit your Research',
  },
  update: {
    create: 'New update',
    edit: 'Edit your update',
  },
}

export const errors = {
  videoUrl: {
    both: 'Do not include both images and video',
    empty: 'Include either images or a video',
    invalidUrl: 'Please provide a valid YouTube Url',
  },
}

export const overview: ILabels = {
  categories: {
    placeholder: 'Select category',
    title: 'Which category fit your research?',
  },
  collaborators: {
    placeholder: 'Select collaborators or start typing to find them',
    title: 'Who is collaborating with you on this research?',
  },
  description: {
    placeholder: `Introduction to your research question. Mention what you want to do, whats the goal and what challenges you see etc (max ${RESEARCH_MAX_LENGTH} characters)`,
    title: 'What are you trying to find out?',
  },
  status: {
    placeholder: 'Select status',
    title: 'What is the status of your research?',
  },
  tags: {
    title: 'Select tags',
  },
  title: {
    placeholder: `Can we make a chair from... (max ${RESEARCH_TITLE_MAX_LENGTH} characters)`,
    title: 'Research Title',
  },
  image: {
    title: 'Cover image',
  },
}

export const update: ILabels = {
  description: {
    placeholder: `Explain what is happening in your research (max ${RESEARCH_MAX_LENGTH} characters)`,
    title: 'Description of this update',
  },
  title: {
    placeholder: `Title of this update (max ${RESEARCH_TITLE_MAX_LENGTH} characters)`,
    title: 'Title of this update',
  },
  images: {
    title: 'Upload image(s) for this update',
  },
  videoUrl: {
    title: 'Or embed a YouTube video',
    placeholder: 'https://youtube.com/watch?v=',
  },
}

export const listing = {
  author: 'Filter by author',
  create: 'Add Research',
  filterCategory: 'Filter by category',
  heading: 'Help out with Research & Development',
  incompleteProfile: 'Complete your profile to add your research',
  join: 'Sign up to add your research',
  loadMore: 'Load More',
  loggedOut:
    'Oh we really want your research knowledge. Trust us. But a login is needed first.',
  noItems: 'No research to show',
  search: 'Search for a research',
  sort: 'Sort by',
  status: 'Filter by status',
}
