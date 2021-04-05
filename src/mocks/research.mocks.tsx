import { IResearch } from '../models/research.models'
import { MOCK_DB_META } from './db.mock'

export const MOCK_RESEARCH_ITEMS: IResearch.ItemDB[] = [
  {
    ...MOCK_DB_META(),
    moderation: 'accepted',
    title: 'Make a big 244 x 122 sheetpress?',
    description: 'We want to see whether we can make a big sheetpress',
    slug: 'make-a-big-244-x-122-sheetpress',
    tags: { 'Plastic Hero': true, 'Another tag': true },
    updates: [
      {
        ...MOCK_DB_META(),
        title: 'Research Online',
        description: 'We looked into some online reach that you can find',
        images: [],
      },
    ],
    _createdBy: 'Precious Plastic Malesia',
  },
  {
    ...MOCK_DB_META(),
    moderation: 'accepted',
    title: 'Run the injection machine on Solar?',
    description: 'Run the injection machine on Solar?',
    slug: 'run-the-injection-machine-on-solar',
    tags: { 'Plastic Hero': true, any: true },
    updates: [
      {
        ...MOCK_DB_META(),
        title: 'Research Online',
        description: 'We looked into some online reach that you can find',
        images: [],
      },
    ],
    _createdBy: 'Zelenew',
  },
]

export const MOCK_UPDATES: IResearch.Update[] = [
  {
    title: 'Trying a small version',
    description: `Ad minus expedita quibusdam. Amet quia recusandae quia sequi. Molestiae adipisci officia rerum officia. Itaque eveniet natus dolores et at quae non hic. Qui odio consequatur id quia quam.
  Consequuntur possimus dolorem dignissimos beatae saepe. Ipsam nemo eos magnam sed. Recusandae modi eum dolorem autem voluptas dolor est.`,
    images: [
      {
        fullPath: 'uploads/howtos/KEhA3Ei4NSmdQgShl9Vp/IMG_20170909_173730.jpg',
        updated: '2020-10-05T09:53:31.625Z',
        name: 'IMG_20170909_173730.jpg',
        contentType: 'image/jpeg',
        size: 255946,
        type: 'image/jpeg',
        downloadUrl:
          'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fhowtos%2FKEhA3Ei4NSmdQgShl9Vp%2FIMG_20170909_173730.jpg?alt=media&token=2464cb94-ed53-4853-acac-9626b8fec079',
        timeCreated: '2020-10-05T09:53:31.625Z',
      },
      {
        downloadUrl:
          'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fhowtos%2FKEhA3Ei4NSmdQgShl9Vp%2FD2rZFtOX4AAY8cv.jpg?alt=media&token=0c3645ee-8551-4247-b5df-d03529a55f57',
        updated: '2020-10-05T09:53:30.263Z',
        name: 'D2rZFtOX4AAY8cv.jpg',
        type: 'image/jpeg',
        contentType: 'image/jpeg',
        timeCreated: '2020-10-05T09:53:30.263Z',
        size: 248912,
        fullPath: 'uploads/howtos/KEhA3Ei4NSmdQgShl9Vp/D2rZFtOX4AAY8cv.jpg',
      },
    ],
  },
  {
    title: 'Melt the HDPE',
    description: `Ad minus expedita quibusdam. Amet quia recusandae quia sequi. Molestiae adipisci officia rerum officia. Itaque eveniet natus dolores et at quae non hic. Qui odio consequatur id quia quam.
  Consequuntur possimus dolorem dignissimos beatae saepe. Ipsam nemo eos magnam sed. Recusandae modi eum dolorem autem voluptas dolor est.`,
    images: [
      {
        fullPath: 'uploads/howtos/KEhA3Ei4NSmdQgShl9Vp/IMG_20170909_173730.jpg',
        updated: '2020-10-05T09:53:31.625Z',
        name: 'IMG_20170909_173730.jpg',
        contentType: 'image/jpeg',
        size: 255946,
        type: 'image/jpeg',
        downloadUrl:
          'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fhowtos%2FKEhA3Ei4NSmdQgShl9Vp%2FIMG_20170909_173730.jpg?alt=media&token=2464cb94-ed53-4853-acac-9626b8fec079',
        timeCreated: '2020-10-05T09:53:31.625Z',
      },
    ],
  },
  {
    title: 'Build a kitchen and workspace in a container',
    description: `Ad minus expedita quibusdam. Amet quia recusandae quia sequi. Molestiae adipisci officia rerum officia. Itaque eveniet natus dolores et at quae non hic. Qui odio consequatur id quia quam.
    Consequuntur possimus dolorem dignissimos beatae saepe.`,
    images: [],
    videoUrl: 'https://www.youtube.com/watch?v=bjU7QKcEUFY',
  },
]
