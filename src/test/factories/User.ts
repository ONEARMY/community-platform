import { faker } from '@faker-js/faker'
import { IModerationStatus } from 'src/models'
import { ProfileType } from 'src/modules/profile/types'

import type { IUserPPDB } from 'src/models'

export const FactoryUser = (
  userOverloads: Partial<IUserPPDB> = {},
): IUserPPDB => ({
  _id: faker.datatype.uuid(),
  _created: faker.date.past().toString(),
  _modified: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _authID: faker.datatype.uuid(),
  profileType: faker.helpers.arrayElement(Object.values(ProfileType)),
  userName: faker.internet.userName(),
  displayName: faker.name.fullName(),
  verified: faker.datatype.boolean(),
  links: [],
  moderation: faker.helpers.arrayElement([
    IModerationStatus.DRAFT,
    IModerationStatus.AWAITING_MODERATION,
    IModerationStatus.REJECTED,
    IModerationStatus.ACCEPTED,
  ]),
  country: faker.address.countryCode(),
  notifications: [],
  coverImages: [] as any[],
  ...userOverloads,
})
