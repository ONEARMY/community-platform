import { faker } from '@faker-js/faker'

import type { ResearchFormData, ResearchItem, ResearchUpdate } from 'oa-shared'

export const FactoryResearchItemUpdate = (
  researchItemUpdateOverloads: Partial<ResearchUpdate> = {},
): ResearchUpdate => ({
  author: null,
  commentCount: 0,
  createdAt: faker.date.past(),
  deleted: false,
  description: faker.lorem.sentences(2),
  id: faker.number.int(),
  images: [],
  files: [],
  fileDownloadCount: faker.number.int(),
  hasFileLink: false,
  modifiedAt: faker.date.past(),
  researchId: faker.number.int(100),
  title: faker.lorem.words(),
  videoUrl: null,
  isDraft: false,
  ...researchItemUpdateOverloads,
})

export const FactoryResearchItem = (
  researchItemOverloads: Partial<ResearchItem> = {},
): ResearchItem => ({
  id: faker.number.int(),
  isDraft: false,
  author: {
    id: faker.number.int(),
    displayName: faker.internet.userName(),
    isSupporter: false,
    isVerified: false,
    photo: {
      id: faker.string.uuid(),
      publicUrl: faker.image.avatar(),
    },
    username: faker.internet.userName(),
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
  status: 'in-progress',
  usefulCount: 2,
  ...researchItemOverloads,
})

export const FactoryResearchItemFormInput = (
  researchItemOverloads: Partial<ResearchFormData> = {},
): ResearchFormData => ({
  title: faker.lorem.words(),
  description: faker.lorem.paragraphs(),
  existingImage: null,
  ...researchItemOverloads,
})
