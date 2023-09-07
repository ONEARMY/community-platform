import { RESEARCH_TITLE_MAX_LENGTH, RESEARCH_MAX_LENGTH } from './constants'

import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  draft: {
    create: 'Save as draft',
    update: 'Save to draft',
  },
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
    title: 'Which categories fit your research?',
  },
  collaborators: {
    placeholder: 'A comma separated list of usernames.',
    title: 'Who have you been collaborating on this Research with?',
  },
  description: {
    placeholder: `Introduction to your research question. Mention what you want to do, whats the goal and what challenges you see etc (max ${RESEARCH_MAX_LENGTH} characters)`,
    title: 'What are you trying to find out?',
  },
  tags: {
    title: 'Select tags',
  },
  title: {
    placeholder: `Can we make a chair from... (max ${RESEARCH_TITLE_MAX_LENGTH} characters)`,
    title: 'Research Title',
  },
}

export const update: ILabels = {
  description: {
    placeholder: `Explain what is happening in your research (max ${RESEARCH_MAX_LENGTH} characters)`,
    title: 'Description of this update',
  },
  fileLink: {
    title: 'Add a download link',
    description: 'Link to Google Drive, Dropbox, Grabcad etc',
  },
  files: {
    title: 'Attach your file(s) for this update',
    description: 'Maximum file size 50MB',
    error: 'Please provide either a file link or upload a file, not both.',
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
