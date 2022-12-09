import type { IUserPPDB } from 'src/models'
import { faker } from '@faker-js/faker'
import { ProfileType } from 'src/modules/profile/types'

export const FactoryUser = (
  userOverloads: Partial<IUserPPDB> = {},
): IUserPPDB => ({
  _id: faker.datatype.uuid(),
  _created: faker.date.past().toString(),
  _modified: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _authID: faker.datatype.uuid(),
  profileType: faker.helpers.arrayElement(Object.values(ProfileType)),
  userName: faker.internet.userName(),
  displayName: faker.name.fullName(),
  verified: faker.datatype.boolean(),
  links: [],
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  notifications: [],
  coverImages: [] as any[],
  ...userOverloads,
})
