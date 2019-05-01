import { IHowto } from '../models/howto.models'
import { IFirebaseUploadInfo } from 'src/components/FirebaseFileUploader/FirebaseFileUploader'
import { toTimestamp } from 'src/utils/helpers'

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
    slug: 'tutorial-1',
    tutorial_description: 'this is a great description 1',
    tutorial_cost: 20,
    difficulty_level: 'Hard',
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
    _id: 'howTo1',
    _deleted: false,
    _createdBy: '123',
    _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
    _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  },
  {
    cover_image: exampleUploadImage,
    tutorial_title: 'Tutorial 2',
    workspace_name: 'Eindhoven Mate',
    slug: 'tutorial-2',
    tutorial_description: 'this is a great description 2',
    tutorial_cost: 20,
    difficulty_level: 'Hard',
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
    _id: 'howTo2',
    _deleted: false,
    _createdBy: '123',
    _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
    _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  },
  {
    cover_image: exampleUploadImage,
    tutorial_title: 'Tutorial 3',
    workspace_name: 'Eindhoven Mate',
    slug: 'tutorial-3',
    tutorial_description: 'this is a great description 3',
    tutorial_cost: 20,
    difficulty_level: 'Hard',
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
    _id: 'howTo3',
    _deleted: false,
    _createdBy: '123',
    _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
    _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  },
]
