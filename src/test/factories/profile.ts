import { faker } from '@faker-js/faker'

import type { DBProfile } from 'oa-shared'

export const FactoryDBProfile = (
  dbProfileOverloads: Partial<DBProfile> = {},
): DBProfile => ({
  id: faker.number.int(),
  username: faker.internet.userName(),
  display_name: faker.internet.userName(),
  photo: {
    id: faker.string.uuid(),
    path: faker.image.avatar(),
    fullPath: faker.image.avatar(),
  },
  country: '',
  roles: [],
  about: '',
  auth_id: '',
  cover_images: null,
  created_at: faker.date.past(),
  impact: null,
  type: 'member',
  pin: undefined,
  visitor_policy: null,
  is_blocked_from_messaging: null,
  is_contactable: false,
  last_active: faker.date.past(),
  website: faker.internet.url(),
  total_views: 0,
  ...dbProfileOverloads,
})
