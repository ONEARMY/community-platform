import { faker } from '@faker-js/faker'
import { IModerationStatus } from '@onearmy.apps/shared'

import { ProfileType } from '../../modules/profile/types'

import type { IUserPPDB } from '../../models'

export const FactoryUser = (
  userOverloads: Partial<IUserPPDB> = {},
): IUserPPDB => ({
  _id: faker.string.uuid(),
  _created: faker.date.past().toString(),
  _modified: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _authID: faker.string.uuid(),
  profileType: faker.helpers.arrayElement(Object.values(ProfileType)),
  userName: faker.internet.userName(),
  displayName: faker.person.fullName(),
  verified: faker.datatype.boolean(),
  links: [],
  moderation: faker.helpers.arrayElement([
    IModerationStatus.DRAFT,
    IModerationStatus.AWAITING_MODERATION,
    IModerationStatus.REJECTED,
    IModerationStatus.ACCEPTED,
  ]),
  country: faker.location.countryCode(),
  notifications: [],
  coverImages: [] as any[],
  ...userOverloads,
})
