import type { IMapPin } from 'src/models'
import { faker } from '@faker-js/faker'
import { ProfileType } from 'src/modules/profile/types'

export const FactoryMapPin = (
  userOverloads: Partial<IMapPin> = {},
): IMapPin => ({
  _id: faker.datatype.uuid(),
  _deleted: faker.datatype.boolean(),
  type: faker.helpers.arrayElement(Object.values(ProfileType)),
  subType: faker.helpers.arrayElement([
    'shredder',
    'sheetpress',
    'extrusion',
    'injection',
    'mix',
  ]),
  verified: faker.datatype.boolean(),
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  location: {
    lng: parseFloat(faker.address.longitude()),
    lat: parseFloat(faker.address.latitude()),
  },
  ...userOverloads,
})
