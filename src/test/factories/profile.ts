import { faker } from '@faker-js/faker';

import type { DBProfile } from 'oa-shared';

export const FactoryDBProfile = (dbProfileOverloads: Partial<DBProfile> = {}): DBProfile => ({
  id: faker.number.int(),
  username: faker.internet.username(),
  display_name: faker.internet.username(),
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
  type: {
    id: faker.number.int(),
    name: faker.word.noun(),
    display_name: faker.word.noun(),
    description: faker.word.noun(),
    image_url: faker.image.avatar(),
    small_image_url: faker.image.avatar(),
    map_pin_name: faker.word.noun(),
    order: faker.number.int(),
    is_space: false,
  },
  pin: undefined,
  visitor_policy: null,
  is_blocked_from_messaging: null,
  is_contactable: false,
  last_active: faker.date.past(),
  website: faker.internet.url(),
  total_views: 0,
  profile_type: faker.number.int(),
  donations_enabled: false,
  ...dbProfileOverloads,
});
