import {
  LIBRARY_DESCRIPTION_MAX_LENGTH,
  LIBRARY_TITLE_MAX_LENGTH,
  LIBRARY_TITLE_MIN_LENGTH,
  STEP_DESCRIPTION_MAX_LENGTH,
  STEP_DESCRIPTION_MIN_LENGTH,
} from './constants'

import type { ILabels } from 'src/common/Form/types'

export const headings = {
  create: '<span>Add</span> your project',
  edit: '<span>Edit</span> your project',
  errors: "Ouch, something's wrong",
  files: 'Do you have supporting files to help others replicate your project?',
  uploading: 'Uploading project',
}

export const buttons = {
  draft: {
    create: 'Save draft',
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
  view: 'View Project',
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
  cover_image_alt: {
    description:
      'This is the alternative text that is read out if the cover image is not available',
    placeholder: 'People working on a house',
    title: 'Cover image alt text',
  },
  description: {
    description: `Provide a short introduction (max ${LIBRARY_DESCRIPTION_MAX_LENGTH} characters)`,
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
    placeholder: `Make a chair from... (${LIBRARY_TITLE_MIN_LENGTH} - ${LIBRARY_TITLE_MAX_LENGTH} characters)`,
    title: 'Title of your project',
  },
}

export const guidance = {
  guides: {
    main:
      '✅ Cover image should show the topic of the guide<br/>' +
      '👍 Few steps we advise having: ' +
      '<ol><li>Explain the Guide</li>' +
      '<li>(As many steps as needed) talk about the process</li>' +
      '<li>(As many steps as needed) talk about the challenges</li>' +
      '<li>Tips & tricks</li>' +
      '<li>Show the final outcome</li></ol>',
  },
  machines: {
    main:
      '✅ Cover image should show the fully built machine<br/>' +
      '👍 Few steps we advise having: ' +
      '<ol><li>Explain the machine</li>' +
      '<li>Mention tools required</li>' +
      '<li>Challenges building the machine </li>' +
      '<li>Explain how to run it</li>' +
      '<li>Tips & tricks</li>' +
      '<li>Link to the Bazar if you sell it there</li></ol>',
  },
  moulds: {
    main:
      '✅ Cover image should show the fully built mould<br/>' +
      '👍 Few steps we advise having:' +
      '<ol><li>Explain the mould</li>' +
      '<li>Mention tools required</li>' +
      '<li>Challenges producing the mould</li>' +
      '<li>Explain how to use the mould</li>' +
      '<li>Tips & tricks</li>' +
      '<li>Show the final product</li>' +
      '<li>Link to the Bazar if you sell it there</li></ol>',
  },
  products: {
    main:
      '✅ Cover image should show the final product<br/>' +
      '👍 Few steps we advise having: ' +
      '<ol><li>Explain the product</li>' +
      '<li>(As many steps as needed) talk about the process</li>' +
      '<li>(As many steps as needed) challenges making the product</li>' +
      '<li>Tips & tricks</li>' +
      '<li>Show the final product</li>' +
      '<li>Link to the Bazar if you sell it there</li></ol>',
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
    placeholder: `Provide a title (max ${LIBRARY_TITLE_MAX_LENGTH} characters)`,
  },
  text: {
    title: 'Step Description',
    placeholder: `Explain what you are doing. If it gets too long, consider breaking it into multiple steps (${STEP_DESCRIPTION_MIN_LENGTH}-${STEP_DESCRIPTION_MAX_LENGTH} characters)`,
  },
  images: {
    title: 'Upload image(s) or a video',
  },
  videoUrl: {
    title: 'YouTube video',
    placeholder: 'https://youtube.com/watch?v=',
  },
}

export const listing = {
  create: 'Add your project',
  join: 'Sign up to add your project',
  incompleteProfile: 'Complete your profile to add your project',
  empty: 'No projects to show!',
  usefulness: 'How useful it is',
  totalComments: 'Total comments',
  filterCategory: 'Filter by category',
  search: 'Search the library',
  sort: 'Sort by category',
  loadMore: 'Load More',
}
