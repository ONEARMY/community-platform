import { faker } from '@faker-js/faker'
import {
  DifficultyLevel,
  type IHowtoDB,
  type IHowtoStep,
  IModerationStatus,
} from 'src/models'

export const FactoryHowto = (
  howtoOverloads: Partial<IHowtoDB> = {},
): IHowtoDB => ({
  files: [],
  fileLink: '',
  difficulty_level: faker.helpers.arrayElement([
    DifficultyLevel.EASY,
    DifficultyLevel.MEDIUM,
    DifficultyLevel.HARD,
    DifficultyLevel.VERY_HARD,
  ]),
  time: '< 1 hour',
  slug: faker.lorem.slug(),
  moderation: faker.helpers.arrayElement([
    IModerationStatus.DRAFT,
    IModerationStatus.AWAITING_MODERATION,
    IModerationStatus.REJECTED,
    IModerationStatus.ACCEPTED,
  ]),
  title: faker.lorem.words(4),
  description: faker.lorem.paragraph(),
  category: {
    label: 'howto',
    _id: faker.datatype.uuid(),
    _modified: faker.date.past().toString(),
    _created: faker.date.past().toString(),
    _deleted: faker.datatype.boolean(),
    _contentModifiedTimestamp: faker.date.past().toString(),
  },
  _id: faker.datatype.uuid(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
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
  votedUsefulBy: [],
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

export const FactoryHowtoDraft = (
  howtoOverloads: Partial<IHowtoDB> = {},
): IHowtoDB => ({
  _id: faker.datatype.uuid(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _createdBy: faker.internet.userName(),
  _deleted: false,
  _modified: faker.date.past().toString(),
  files: [],
  slug: 'quick-draft',
  moderation: IModerationStatus.DRAFT,
  mentions: [],
  title: 'Quick draft',
  steps: [],
  previousSlugs: [],
  tags: {},
  total_downloads: 0,
  ...howtoOverloads,
})
