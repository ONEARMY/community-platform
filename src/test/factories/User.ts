import { faker } from '@faker-js/faker'
import { ProfileTypeList } from 'oa-shared'

import type { Image, Profile } from 'oa-shared'

export const factoryImage: Image = {
  id: '123',
  publicUrl:
    'https://firebasestorage.googleapis.com/v0/b/onearmyworld.appspot.com/o/uploads%2Fv2_howtos%2Fme5Bq0wq5FdoJUY8gELN%2FBope-brick-5.jpg?alt=media&token=b29153ce-58fd-4c28-ac87-82f0b2f7c54c',
}

export const FactoryUser = (
  userOverloads: Partial<Profile> = {},
): Partial<Profile> => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  type: faker.helpers.arrayElement(Object.values(ProfileTypeList)),
  username: faker.internet.userName(),
  displayName: faker.person.fullName(),
  badges: [
    {
      id: 1,
      name: 'pro',
      displayName: 'PRO',
      imageUrl: faker.image.avatar(),
    },
    {
      id: 2,
      name: 'supporter',
      displayName: 'Supporter',
      actionUrl: faker.internet.url(),
      imageUrl: faker.image.avatar(),
    },
  ],
  website: faker.internet.url(),
  country: faker.location.countryCode(),
  coverImages: [] as any[],
  ...userOverloads,
})
