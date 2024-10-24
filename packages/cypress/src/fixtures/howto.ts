import dateformat from 'dateformat'
import { DifficultyLevel, IModerationStatus } from 'oa-shared'

import { generateAlphaNumeric } from '../utils/TestUtils'

import type { IHowtoDB } from 'oa-shared'

const _id = generateAlphaNumeric(20)
const _created = dateformat(Date.now(), 'yyyy-mm-dd')

export const howto: IHowtoDB = {
  _id,
  _deleted: false,
  _createdBy: 'howto_super_user',
  _created,
  title: 'Howto for discussion',
  slug: 'howto-for-discussion',
  previousSlugs: [],
  mentions: [],
  totalComments: 0,
  time: '< 1 week',
  description: 'Hi! Super quick how-to for commenting',
  difficulty_level: DifficultyLevel.EASY,
  files: [],
  fileLink: 'http://google.com/',
  total_downloads: 10,
  steps: [
    {
      title: 'Get the code',
      images: [
        {
          timeCreated: '2019-07-08T07:24:16.883Z',
          name: '1.jpg',
          fullPath: 'uploads/howtosV1/DBgbCKle7h4CcNxeUP2V/1.jpg',
          type: 'image/jpeg',
          updated: '2019-07-08T07:24:16.883Z',
          size: 92388,
          downloadUrl:
            'https://firebasestorage.googleapis.com/v0/b/onearmyworld.appspot.com/o/uploads%2FhowtosV1%2FDBgbCKle7h4CcNxeUP2V%2F1.jpg?alt=media&token=439a1dea-2dfc-4514-b725-d38aad85fe88',
          contentType: 'image/jpeg',
        },
      ],
      text: 'First step go to Github, and download or clone our code. I’d recommend to install the Github app to add pull request in a later stage.\n',
      _animationKey: 'unique1',
    },
  ],
  moderation: IModerationStatus.ACCEPTED,
  tags: {},
  category: {
    _id: '000',
    _created,
    _deleted: false,
    label: 'product',
  },
}
