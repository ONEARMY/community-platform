import { IHowto } from '../models/howto.models'
import { IFirebaseUploadInfo } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'

const exampleUploadImage: IFirebaseUploadInfo = {
  downloadUrl: 'http://placekitten.com/g/400/250',
  fullPath: '',
  name: '250.jpg',
  size: 11035,
  timeCreated: '',
  updated: '',
}

export const TUTORIALS_MOCK: IHowto[] = [
  {
    cover_image: exampleUploadImage,
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
        images: [exampleUploadImage],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [exampleUploadImage, exampleUploadImage],
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
    cover_image: exampleUploadImage,
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
        images: [exampleUploadImage, exampleUploadImage],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [exampleUploadImage],
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
    cover_image: exampleUploadImage,
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
        images: [exampleUploadImage],
        text: 'this text is wonderful oh my god',
        title: 'My super step1 title',
      },
      {
        images: [exampleUploadImage],
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
