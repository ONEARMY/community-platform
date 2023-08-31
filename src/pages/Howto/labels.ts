import {
  HOWTO_STEP_DESCRIPTION_MIN_LENGTH,
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
  HOWTO_TITLE_MAX_LENGTH,
} from './constants'

import type { ILabels } from 'src/common/Form/types'

export const headings = {
  create: '<span>Create</span> a How-To',
  edit: '<span>Edit</span> a How-To',
  errors: "Ouch, something's wrong",
  files: 'Do you have supporting files to help others replicate your How-to?',
  uploading: 'Uploading How To',
}

export const buttons = {
  draft: {
    create: 'Save draft',
    update: 'Revert to draft',
    description: 'A draft can be saved any time',
  },
  files: 'Re-upload files (this will delete the existing ones)',
  publish: 'Publish',
  steps: {
    deleteButton: {
      title: 'Delete',
      cancel: 'Cancel',
      warning: 'Are you sure you want to delete this step?',
    },
    add: 'Add step',
  },
  view: 'View How-To',
}

export const errors = {
  videoUrl: {
    both: 'Do not include both images and video',
    empty: 'Include either images or a video',
    invalidUrl: 'Please provide a valid YouTube Url',
  },
}

export const intro: ILabels = {
  category: {
    placeholder: 'Select one category',
    title: 'Category',
  },
  cover_image: {
    description: 'This image should be landscape. We advise 1280x960px',
    title: 'Cover image',
  },
  description: {
    description: `Provide a short introduction (max ${HOWTO_MAX_LENGTH} characters)`,
    title: 'Short description',
  },
  difficulty_level: {
    placeholder: 'How hard is it?',
    title: 'Difficulty level?',
  },
  fileLink: {
    title: 'Add a download link',
    description: 'Link to Google Drive, Dropbox, Grabcad etc',
  },
  files: {
    title: 'Or upload your files here',
    description: 'Maximum file size 50MB',
    error: 'Please provide either a file link or upload a file, not both.',
  },
  heading: {
    title: 'Intro',
  },
  tags: {
    title: 'Select tags',
  },
  time: {
    placeholder: 'How much time?',
    title: 'How long does it take?',
  },
  title: {
    placeholder: `Make a chair from... (${HOWTO_TITLE_MIN_LENGTH} - ${HOWTO_TITLE_MAX_LENGTH} characters)`,
    title: 'Title of your How-to',
  },
}

export const steps: ILabels = {
  heading: {
    description:
      "Each step needs an intro, a description and photos or video. You'll need to have <strong>at least three steps</strong>.",
    title: 'Step',
  },
  title: {
    title: 'Title of this step',
    placeholder: `Provide a title (max ${HOWTO_TITLE_MAX_LENGTH} characters)`,
  },
  text: {
    title: 'Step Description',
    placeholder: `Explain what you are doing. If it gets too long, consider breaking it into multiple steps (${HOWTO_STEP_DESCRIPTION_MIN_LENGTH}-${HOWTO_STEP_DESCRIPTION_MAX_LENGTH} characters)`,
  },
  images: {
    title: 'Upload image(s) or a video',
  },
  videoUrl: {
    title: 'YouTube video',
    placeholder: 'https://youtube.com/watch?v=',
  },
}
