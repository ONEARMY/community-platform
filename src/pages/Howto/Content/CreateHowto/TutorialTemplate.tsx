import { IHowtoFormInput } from 'src/models/howto.models'

const INITIAL_VALUES: IHowtoFormInput = {
  tutorial_description: '',
  tutorial_title: '',
  tutorial_time: '',
  tutorial_cost: null,
  difficulty_level: '',
  cover_image: null,
  tutorial_extern_file_url: '',
  tutorial_files: [],
  id: '',
  slug: '',
  steps: [
    {
      title: '',
      text: '',
      images: [],
    },
    {
      title: '',
      text: '',
      images: [],
    },
    {
      title: '',
      text: '',
      images: [],
    },
  ],
  tags: {},
  workspace_name: '',
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
}
