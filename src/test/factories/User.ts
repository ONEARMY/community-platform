import { faker } from '@faker-js/faker'
import { ProfileTypeList } from 'oa-shared'

import type { IUploadedFileMeta, Profile } from 'oa-shared'

export const factoryImage: IUploadedFileMeta = {
  timeCreated: '2019-09-27T14:58:41.378Z',
  name: 'name.jpg',
  fullPath: 'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/name.jpg',
  type: 'image/jpeg',
  updated: '2019-09-27T14:58:41.378Z',
  size: 24501,
  downloadUrl:
    'https://firebasestorage.googleapis.com/v0/b/onearmyworld.appspot.com/o/uploads%2Fv2_howtos%2Fme5Bq0wq5FdoJUY8gELN%2FBope-brick-5.jpg?alt=media&token=b29153ce-58fd-4c28-ac87-82f0b2f7c54c',
  contentType: 'image/jpeg',
}

export const FactoryUser = (
  userOverloads: Partial<Profile> = {},
): Partial<Profile> => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  type: faker.helpers.arrayElement(Object.values(ProfileTypeList)),
  username: faker.internet.userName(),
  displayName: faker.person.fullName(),
  isVerified: faker.datatype.boolean(),
  isSupporter: faker.datatype.boolean(),
  website: faker.internet.url(),
  country: faker.location.countryCode(),
  coverImages: [] as any[],
  ...userOverloads,
})
