import type { IHowtoDB, IHowtoStep } from 'src/models'
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
  mentions: [],
  previousSlugs: [],
  cover_image: {
    downloadUrl: '',
    name: '',
    type: '',
    timeCreated: '',
    fullPath: '',
    updated: '',
    size: 0,
  },
  total_views: faker.datatype.number(),
  total_downloads: faker.datatype.number(),
  ...howtoOverloads,
})

export const FactoryHowtoStep = (
  howtoStepOverloads: Partial<IHowtoStep> = {},
): IHowtoStep => ({
  images: [
    {
      downloadUrl: faker.internet.url(),
      fullPath: faker.internet.url(),
      name: faker.lorem.text(),
      type: 'string',
      size: 2300,
      timeCreated: faker.date.past().toString(),
      updated: faker.date.past().toString(),
    },
  ],
  title: faker.lorem.text(),
  text: faker.lorem.paragraphs(2),
  ...howtoStepOverloads,
})
