import { ITutorial } from '../models/tutorial.models'

export const TUTORIALS_MOCK: ITutorial[] = [
  {
    cover_image_url: 'http://placekitten.com/g/400/250',
    tutorial_title: 'Tutorial 1',
    workspace_name: 'Eindhoven Mate',
    id: 'fakeid1',
    slug: 'tutorial-1',
    tutorial_description: 'this is a great description 1',
    tutorial_cost: 20,
    difficulty_level: 'difficult',
    tutorial_time: '30 hours',
    steps: [
      {
        images: ['http://placekitten.com/g/400/250'],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [
          'http://placekitten.com/g/400/250',
          'http://placekitten.com/400/250',
        ],
        text: 'this text is wonderful oh my god',
        title: 'My super step2 title',
      },
    ],
    tags: {},
    tutorial_extern_file_url: '',
    tutorial_files: [],
    _created: new Date(),
    _modified: new Date(),
  },
  {
    cover_image_url: 'http://placekitten.com/g/400/250',
    tutorial_title: 'Tutorial 2',
    workspace_name: 'Eindhoven Mate',
    id: 'fakeid2',
    slug: 'tutorial-2',
    tutorial_description: 'this is a great description 2',
    tutorial_cost: 20,
    difficulty_level: 'difficult',
    tutorial_time: '30 hours',
    steps: [
      {
        images: [
          'http://placekitten.com/400/250',
          'http://placekitten.com/g/400/250',
        ],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [
          'http://placekitten.com/g/400/250',
          'http://placekitten.com/400/250',
        ],
        text: 'this text is wonderful oh my god',
        title: 'My super step2 title',
      },
    ],
    tags: {},
    tutorial_extern_file_url: '',
    tutorial_files: [],
    _created: new Date(),
    _modified: new Date(),
  },
  {
    cover_image_url: 'http://placekitten.com/g/400/250',
    tutorial_title: 'Tutorial 3',
    workspace_name: 'Eindhoven Mate',
    id: 'fakeid3',
    slug: 'tutorial-3',
    tutorial_description: 'this is a great description 3',
    tutorial_cost: 20,
    difficulty_level: 'difficult',
    tutorial_time: '30 days',
    steps: [
      {
        images: [
          'http://placekitten.com/400/250',
          'http://placekitten.com/g/400/250',
        ],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [
          'http://placekitten.com/g/400/250',
          'http://placekitten.com/400/250',
        ],
        text: 'this text is wonderful oh my god',
        title: 'My super step2 title',
      },
    ],
    tags: {},
    tutorial_extern_file_url: '',
    tutorial_files: [],
    _created: new Date(),
    _modified: new Date(),
  },
]
