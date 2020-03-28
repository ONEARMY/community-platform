import { IHowtoFormInput } from 'src/models/howto.models'

// initialise fields which contain nested objects (and steps to have 3 placeholders)
const INITIAL_VALUES: Partial<IHowtoFormInput> = {
  steps: [
    {
      title: 'EDITABLE',
      text: '',
      images: [],
      _animationKey: 'unique1',
    },
    {
      title: 'EDITABLE',
      text: '',
      images: [],
      _animationKey: 'unique2',
    },
    {
      title: 'EDITABLE',
      text: '',
      images: [],
      _animationKey: 'unique3',
    },
  ],
  tags: {},
  files: [],
}

const TESTING_VALUES: Partial<IHowtoFormInput> = {
  title: `Test-${new Date().toString()}`,
  description: 'example description',
  time: '1-2 weeks',
  difficulty_level: 'Hard',
  files: [],
  steps: [
    {
      title: 'Step 1',
      text: 'Example step text',
      images: [],
      _animationKey: 'unique1',
    },
  ],
}

export default {
  INITIAL_VALUES,
  TESTING_VALUES,
}
