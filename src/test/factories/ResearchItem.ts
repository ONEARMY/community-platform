import { faker } from '@faker-js/faker'

import type {
  DBResearchItem,
  DBResearchUpdate,
  ResearchFormData,
  ResearchItem,
  ResearchUpdate,
} from 'oa-shared'

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
  research: undefined,
  ...researchItemUpdateOverloads,
})

export const FactoryDBResearchItemUpdate = (
  researchDBItemUpdateOverloads: Partial<DBResearchUpdate> = {},
): DBResearchUpdate => ({
  created_by: faker.number.int(100),
  comment_count: 0,
  created_at: faker.date.past(),
  deleted: false,
  description: faker.lorem.sentences(2),
  id: faker.number.int(),
  images: [],
  files: [],
  file_download_count: faker.number.int(),
  file_link: '',
  modified_at: faker.date.past(),
  research_id: faker.number.int(100),
  title: faker.lorem.words(),
  video_url: null,
  is_draft: false,
  ...researchDBItemUpdateOverloads,
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
    photoUrl: faker.image.avatar(),
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

export const FactoryDBResearchItem = (
  researchItemOverloads: Partial<DBResearchItem> = {},
): DBResearchItem => ({
  id: faker.number.int(),
  is_draft: false,
  created_by: faker.number.int(),
  modified_at: faker.date.past(),
  created_at: faker.date.past(),
  deleted: faker.datatype.boolean(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  previous_slugs: [],
  collaborators: [],
  updates: [FactoryDBResearchItemUpdate()],
  tags: [],
  total_views: faker.number.int(),
  subscriber_count: faker.number.int(),
  comment_count: 0,
  category: null,
  image: null,
  update_count: 0,
  status: 'in-progress',
  useful_count: 2,
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
