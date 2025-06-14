import type { ProjectFormData } from 'oa-shared'

// initialise fields which contain nested objects (and steps to have 3 placeholders)
const INITIAL_VALUES: Partial<ProjectFormData> = {
  steps: [
    {
      title: '',
      description: '',
      images: [],
      existingImages: null,
    },
    {
      title: '',
      description: '',
      images: [],
      existingImages: null,
    },
    {
      title: '',
      description: '',
      images: [],
      existingImages: null,
    },
  ],
  tags: [],
  files: [],
}

const TESTING_VALUES: Partial<ProjectFormData> = {
  title: `Test-${new Date().toString()}`,
  description: 'example description',
  time: '1-2 weeks',
  difficultyLevel: 'hard',
  files: [],
  steps: [
    {
      title: 'Step 1',
      description: 'Example step text',
      images: [],
      existingImages: null,
    },
  ],
}

export default {
  INITIAL_VALUES,
  TESTING_VALUES,
}
