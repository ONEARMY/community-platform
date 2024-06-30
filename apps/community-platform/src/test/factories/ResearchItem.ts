import { faker } from '@faker-js/faker'
import { IModerationStatus, ResearchUpdateStatus } from '@onearmy.apps/shared'

import type {
  IResearchDB,
  IResearchFormInput,
  IResearchUpdateDB,
} from '../../models'

type ResearchCalculatedFields = {
  userHasSubscribed: boolean
}

export const FactoryResearchItemUpdate = (
  researchItemUpdateOverloads: Partial<IResearchUpdateDB> = {},
): IResearchUpdateDB => ({
  title: faker.lorem.words(),
  description: faker.lorem.sentences(2),
  images: [],
  files: [],
  fileLink: faker.internet.url(),
  downloadCount: 0,
  _id: faker.string.uuid(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  status: faker.helpers.arrayElement(Object.values(ResearchUpdateStatus)),
  ...researchItemUpdateOverloads,
})

export const FactoryResearchItem = (
  researchItemOverloads: Partial<IResearchDB & ResearchCalculatedFields> = {},
): IResearchDB & ResearchCalculatedFields => ({
  _id: faker.string.uuid(),
  _createdBy: faker.internet.userName(),
  _modified: faker.date.past().toString(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  updates: [FactoryResearchItemUpdate()],
  tags: {},
  moderation: faker.helpers.arrayElement([
    IModerationStatus.DRAFT,
    IModerationStatus.AWAITING_MODERATION,
    IModerationStatus.REJECTED,
    IModerationStatus.ACCEPTED,
  ]),
  mentions: [],
  previousSlugs: [],
  total_views: faker.number.int(),
  collaborators: [],
  subscribers: [],
  userHasSubscribed: faker.datatype.boolean(),
  totalCommentCount: 0,
  ...researchItemOverloads,
})

export const FactoryResearchItemFormInput = (
  researchItemOverloads: Partial<IResearchFormInput> = {},
): IResearchFormInput => ({
  _id: faker.string.uuid(),
  _createdBy: faker.internet.userName(),
  description: faker.lorem.paragraphs(),
  title: faker.lorem.words(),
  slug: faker.lorem.slug(),
  tags: {},
  moderation: faker.helpers.arrayElement([
    IModerationStatus.DRAFT,
    IModerationStatus.AWAITING_MODERATION,
    IModerationStatus.REJECTED,
    IModerationStatus.ACCEPTED,
  ]),
  collaborators: '',
  ...researchItemOverloads,
})
