import { faker } from '@faker-js/faker'
import { ExternalLinkLabel, ProfileTypeList } from 'oa-shared'

import type { IExternalLink, IUploadedFileMeta, IUserDB } from 'oa-shared'

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

export const factoryLink: IExternalLink = {
  key: '546sfg',
  url: 'https://bbc.co.uk/',
  label: ExternalLinkLabel.WEBSITE,
}

export const FactoryUser = (userOverloads: Partial<IUserDB> = {}): IUserDB => ({
  _id: faker.string.uuid(),
  _created: faker.date.past().toString(),
  _modified: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _authID: faker.string.uuid(),
  profileType: faker.helpers.arrayElement(Object.values(ProfileTypeList)),
  userName: faker.internet.userName(),
  displayName: faker.person.fullName(),
  verified: faker.datatype.boolean(),
  links: [],
  country: faker.location.countryCode(),
  notifications: [],
  coverImages: [] as any[],
  ...userOverloads,
})
