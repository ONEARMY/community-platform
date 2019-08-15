import { IHowto } from '../models/howto.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { MOCK_DB_META } from './db.mock'

const exampleUploadImage: IUploadedFileMeta = {
  downloadUrl: 'http://placekitten.com/g/400/250',
  fullPath: '',
  name: '250.jpg',
  size: 11035,
  timeCreated: '',
  updated: '',
  type: 'image/jpg',
}

export const HOWTO_MOCK: IHowto[] = [
  {
    cover_image: exampleUploadImage,
    title: 'How-To 1',
    slug: 'how-to-1',
    description: 'this is a great description 1',
    difficulty_level: 'Hard',
    time: '30 hours',
    steps: [
      {
        images: [],
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
    files: [],
    ...MOCK_DB_META('howTo1'),
  },
  {
    cover_image: exampleUploadImage,
    title: 'How-to 2',
    slug: 'how-to-2',
    description: 'this is a great description 2',
    difficulty_level: 'Hard',
    time: '30 hours',
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
    files: [],
    ...MOCK_DB_META('howTo2'),
  },
  {
    cover_image: exampleUploadImage,
    title: 'How-to 3',
    slug: 'how-to-3',
    description: 'this is a great description 3',
    difficulty_level: 'Hard',
    time: '30 days',
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
    files: [],
    ...MOCK_DB_META('howTo3'),
  },
]
