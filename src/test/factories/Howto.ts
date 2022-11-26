import type { IHowtoDB } from 'src/models'
import { faker } from '@faker-js/faker'

export const FactoryHowto = (
  howtoOverloads: Partial<IHowtoDB> = {},
): IHowtoDB => ({
  files: [],
  difficulty_level: faker.helpers.arrayElement([
    'Easy',
    'Medium',
    'Hard',
    'Very Hard',
  ]),
  time: '',
  slug: faker.lorem.slug(),
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  title: faker.lorem.words(4),
  description: faker.lorem.paragraph(),
  _id: faker.datatype.uuid(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _createdBy: faker.internet.userName(),
  steps: [],
  cover_image: {
    downloadUrl: '',
    name: '',
    type: '',
    timeCreated: '',
    fullPath: '',
    updated: '',
    size: 0,
  },
  ...howtoOverloads,
})
