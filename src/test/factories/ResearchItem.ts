import { faker } from '@faker-js/faker'
import { ResearchStatus } from 'oa-shared'

import type { ResearchFormData, ResearchItem, ResearchUpdate } from 'oa-shared'

export const FactoryResearchItemUpdate = (
  researchItemUpdateOverloads: Partial<ResearchUpdate> = {},
): ResearchUpdate => ({
  title: faker.lorem.words(),
  commentCount: 0,
  description: faker.lorem.sentences(2),
  images: [],
  files: [],
  hasFileLink: false,
  fileDownloadCount: faker.number.int(),
  id: faker.number.int(),
  modifiedAt: faker.date.past(),
  createdAt: faker.date.past(),
  deleted: false,
  author: null,
  videoUrl: null,
  isDraft: false,
  ...researchItemUpdateOverloads,
})

export const FactoryResearchItem = (
  researchItemOverloads: Partial<ResearchItem> = {},
): ResearchItem => ({
  id: faker.number.int(),
  author: {
    id: faker.number.int(),
    name: faker.person.firstName(),
    username: faker.internet.userName(),
    isSupporter: false,
    isVerified: false,
  },
  modifiedAt: faker.date.past(),
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  previousSlugs: [],
  collaboratorsUsernames: [],
  updates: [FactoryResearchItemUpdate()],
  tags: [],
  totalViews: faker.number.int(),
  collaborators: [],
  subscriberCount: faker.number.int(),
  commentCount: 0,
  category: null,
  image: null,
  updateCount: 0,
  status: ResearchStatus.IN_PROGRESS,
  usefulCount: 2,
  ...researchItemOverloads,
})

export const FactoryResearchItemFormInput = (
  researchItemOverloads: Partial<ResearchFormData> = {},
): ResearchFormData => ({
  title: faker.lorem.words(),
  description: faker.lorem.paragraphs(),
  status: ResearchStatus.IN_PROGRESS,
  existingImage: null,
  ...researchItemOverloads,
})
