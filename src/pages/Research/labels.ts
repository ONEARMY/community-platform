import { RESEARCH_TITLE_MAX_LENGTH, RESEARCH_MAX_LENGTH } from './constants'
import { videoUrl } from '../../../src/utils/labels'

export const buttons = {
  draft: {
    create: 'Save as draft',
    update: 'Save to draft',
  },
  publish: 'Publish',
}

export const overview = {
  headings: {
    create: 'Start your Research',
    edit: 'Edit your Research',
  },
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

export const update = {
  deletion: {
    button: 'Delete this update',
    confirm: 'Delete',
    message: 'Are you sure you want to delete this update?',
  },
  description: {
    placeholder: `Explain what is happening in your research (max ${RESEARCH_MAX_LENGTH} characters)`,
    title: 'Description of this update',
  },
  headings: {
    create: 'New update',
    edit: 'Edit your update',
  },
  title: {
    placeholder: `Title of this update (max ${RESEARCH_TITLE_MAX_LENGTH} characters)`,
    title: 'Title of this update',
  },
  images: {
    title: 'Upload image(s) for this update',
  },
  videoUrl,
}
