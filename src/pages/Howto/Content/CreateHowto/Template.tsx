import { IHowtoFormInput } from 'src/models/howto.models'

// initialise fields which contain nested objects (and steps to have 3 placeholders)
const INITIAL_VALUES: Partial<IHowtoFormInput> = {
  steps: [
    {
      title: '',
      text: '',
      images: [],
      caption: '',
      _animationKey: 'unique1',
    },
    {
      title: '',
      text: '',
      images: [],
      caption: '',
      _animationKey: 'unique2',
    },
    {
      title: '',
      text: '',
      images: [],
      caption: '',
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

const TIME_OPTIONS = [
  {
    value: '< 1 week',
    label: '< 1 week',
  },
  {
    value: '1-2 weeks',
    label: '1-2 weeks',
  },
  {
    value: '3-4 weeks',
    label: '3-4 weeks',
  },
  {
    value: '1+ months',
    label: '1+ months',
  },
]

const DIFFICULTY_OPTIONS = [
  {
    value: 'Easy',
    label: 'Easy',
  },
  {
    value: 'Medium',
    label: 'Medium',
  },
  {
    value: 'Hard',
    label: 'Hard',
  },
  {
    value: 'Very Hard',
    label: 'Very Hard',
  },
]

export default {
  INITIAL_VALUES,
  TIME_OPTIONS,
  DIFFICULTY_OPTIONS,
  TESTING_VALUES,
}
