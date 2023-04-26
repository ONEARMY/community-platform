import { faker } from '@faker-js/faker'
import type { IResearch, IResearchDB } from 'src/models'

export const FactoryResearchItemUpdate = (
  researchItemUpdateOverloads: Partial<IResearch.UpdateDB> = {},
): IResearch.UpdateDB => ({
  title: faker.lorem.words(),
  description: faker.lorem.sentences(2),
  images: [],
  _id: faker.datatype.uuid(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  status: faker.helpers.arrayElement(['draft', 'published']),
  ...researchItemUpdateOverloads,
})

export const FactoryResearchItem = (
  researchItemOverloads: Partial<IResearchDB> = {},
): IResearchDB => ({
  _id: faker.datatype.uuid(),
  _createdBy: faker.internet.userName(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  updates: [FactoryResearchItemUpdate()],
  tags: {},
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  mentions: [],
  total_views: faker.datatype.number(),
  collaborators: [],
  ...researchItemOverloads,
})

export const FactoryResearchItemFormInput = (
  researchItemOverloads: Partial<IResearch.FormInput> = {},
): IResearch.FormInput => ({
  _id: faker.datatype.uuid(),
  _createdBy: faker.internet.userName(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  tags: {},
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  collaborators: '',
  ...researchItemOverloads,
})
