import { faker } from '@faker-js/faker'

import type {
  DifficultyLevel,
  Moderation,
  Project,
  // ProjectFormData,
  ProjectStep,
} from 'oa-shared'

export const FactoryLibraryItem = (
  itemOverloads: Partial<Project> = {},
): Project => ({
  files: [],
  hasFileLink: faker.datatype.boolean(),
  difficultyLevel: faker.helpers.arrayElement<DifficultyLevel>([
    'easy',
    'medium',
    'hard',
    'very-hard',
  ]),
  time: '< 1 hour',
  slug: faker.lorem.slug(),
  moderation: faker.helpers.arrayElement<Moderation>([
    'awaiting-moderation',
    'improvements-needed',
    'accepted',
    'rejected',
  ]),
  title: faker.lorem.words(4),
  description: faker.lorem.paragraph(),
  category: {
    id: faker.number.int(),
    modifiedAt: faker.date.past(),
    createdAt: faker.date.past(),
    name: faker.lorem.word(),
    type: 'projects',
  },
  id: faker.number.int(),
  isDraft: false,
  modifiedAt: faker.date.past(),
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  steps: [],
  previousSlugs: [],
  coverImage: null,
  totalViews: faker.number.int(),
  usefulCount: faker.number.int(),
  subscriberCount: faker.number.int(),
  fileDownloadCount: faker.number.int(),
  commentCount: 0,
  author: null,
  tags: [],
  ...itemOverloads,
})

export const FactoryLibraryItemStep = (
  itemOverloads: Partial<ProjectStep> = {},
): ProjectStep => ({
  id: faker.number.int(),
  projectId: faker.number.int(),
  images: [
    {
      publicUrl: faker.internet.url(),
      id: faker.string.uuid(),
    },
  ],
  title: faker.lorem.text(),
  description: faker.lorem.paragraphs(2),
  videoUrl: faker.internet.url(),
  order: faker.number.int(),
  ...itemOverloads,
})

export const FactoryLibraryItemDraft = (
  itemOverloads: Partial<Project> = {},
): Project => ({
  id: faker.number.int(),
  isDraft: false,
  modifiedAt: faker.date.past(),
  createdAt: faker.date.past(),
  author: {
    id: faker.number.int(),
    displayName: faker.person.firstName(),
    isSupporter: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),
    photoUrl: faker.image.avatar(),
    username: faker.internet.userName(),
  },
  deleted: false,
  files: [],
  slug: 'quick-draft',
  moderation: 'awaiting-moderation',
  title: 'Quick draft',
  steps: [],
  previousSlugs: [],
  tags: [],
  category: null,
  coverImage: null,
  description: faker.lorem.sentence(),
  difficultyLevel: 'easy',
  hasFileLink: false,
  fileDownloadCount: faker.number.int(),
  commentCount: faker.number.int(),
  subscriberCount: faker.number.int(),
  totalViews: faker.number.int(),
  usefulCount: faker.number.int(),
  ...itemOverloads,
})

// export const FactoryLibraryForm = (
//   itemOverloads: Partial<ProjectFormData> = {},
// ): ProjectFormData => ({
//   files: [],
//   fileLink: faker.internet.url(),
//   difficultyLevel: faker.helpers.arrayElement<DifficultyLevel>([
//     'easy',
//     'medium',
//     'hard',
//     'very-hard',
//   ]),
//   time: '< 1 hour',
//   title: faker.lorem.words(4),
//   description: faker.lorem.paragraph(),
//   category: { value: faker.number.int().toString(), label: faker.lorem.word() },
//   tags: [],
//   existingCoverImage: null,
//   steps: [],
//   ...itemOverloads,
// })
