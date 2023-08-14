import {
  HOWTO_STEP_DESCRIPTION_MIN_LENGTH,
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
  HOWTO_TITLE_MAX_LENGTH,
} from './constants'

export const headings = {
  create: '<span>Create</span> a How-To',
  edit: '<span>Edit</span> a How-To',
  errors: "Ouch, something's wrong",
  uploading: 'Uploading How To',
}

export const buttons = {
  draft: {
    create: 'Save draft',
    update: 'Revert to draft',
    description: 'A draft can be saved any time',
  },
  publish: 'Publish',
  view: 'View How-To',
}

export const intro = {
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
  files: {
    title: 'Do you have supporting files to help others replicate your How-to?',
    link: {
      title: 'Add a download link',
      description: 'Link to Google Drive, Dropbox, Grabcad etc',
    },
    upload: {
      title: 'Or upload your files here',
      description: 'Maximum file size 50MB',
      warning: 'Re-upload files (this will delete the existing ones)',
    },
    error: 'Please provide either a file link or upload a file, not both.',
  },
  heading: 'Intro',
  tags: 'Select tags',
  time: {
    placeholder: 'How much time?',
    title: 'How long does it take?',
  },
  title: {
    placeholder: `Make a chair from... (${HOWTO_TITLE_MIN_LENGTH} - ${HOWTO_TITLE_MAX_LENGTH} characters)`,
    title: 'Title of your How-to',
  },
}

export const steps = {
  heading: {
    description:
      "Each step needs an intro, a description and photos or video. You'll need to have <strong>at least three steps</strong>.",
    title: 'Step',
  },
  buttons: {
    deleteButton: {
      title: 'Delete',
      cancel: 'Cancel',
      warning: 'Are you sure you want to delete this step?',
    },
    add: 'Add step',
  },
  title: {
    title: 'Title of this step',
    placeholder: `Provide a title (max ${HOWTO_TITLE_MAX_LENGTH} characters)`,
  },
  text: {
    title: 'Step Description',
    placeholder: `Explain what you are doing. If it gets too long, consider breaking it into multiple steps (${HOWTO_STEP_DESCRIPTION_MIN_LENGTH}-${HOWTO_STEP_DESCRIPTION_MAX_LENGTH} characters)`,
  },
  images: 'Upload image(s) or a video',
  videoUrl: {
    placeholder: 'https://youtube.com/watch?v=',
    errors: {
      both: 'Do not include both images and video',
      empty: 'Include either images or a video',
      invalidUrl: 'Please provide a valid YouTube Url',
    },
  },
}
