import { faker } from '@faker-js/faker'

import type { DBProfile } from 'oa-shared'

export const FactoryDBProfile = (
  dbProfileOverloads: Partial<DBProfile> = {},
): DBProfile => ({
  id: faker.number.int(),
  username: faker.internet.userName(),
  display_name: faker.internet.userName(),
  is_verified: faker.datatype.boolean(),
  is_supporter: faker.datatype.boolean(),
  photo_url: faker.image.avatar(),
  country: '',
  roles: [],
  ...dbProfileOverloads,
})
