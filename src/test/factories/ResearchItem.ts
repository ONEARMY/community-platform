import { faker } from '@faker-js/faker'
import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'

import type {
  ResearchFormData,
  ResearchItem,
  ResearchUpdate,
} from 'src/models/research.model'

export const FactoryResearchItemUpdate = (
  researchItemUpdateOverloads: Partial<ResearchUpdate> = {},
): ResearchUpdate => ({
  title: faker.lorem.words(),
  commentCount: 0,
  description: faker.lorem.sentences(2),
  images: [],
  files: [],
  id: faker.number.int(),
  modifiedAt: faker.date.past(),
  createdAt: faker.date.past(),
  deleted: false,
  author: null,
  videoUrl: null,
  fileLink: null,
  status: ResearchUpdateStatus.PUBLISHED,
  ...researchItemUpdateOverloads,
})

export const FactoryResearchItem = (
  researchItemOverloads: Partial<ResearchItem> = {},
): ResearchItem => ({
  id: faker.number.int(),
  author: {
    id: faker.number.int(),
    name: faker.name.firstName(),
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
  updates: [FactoryResearchItemUpdate()],
  tags: [],
  totalViews: faker.number.int(),
  collaborators: [],
  subscriberCount: faker.number.int(),
  commentCount: 0,
  category: null,
  images: [],
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
  ...researchItemOverloads,
})
