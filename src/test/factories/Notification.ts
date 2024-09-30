import { faker } from '@faker-js/faker'
import { NotificationTypes } from 'oa-shared'

import type { INotification } from 'oa-shared'

export const FactoryNotification = (
  userOverloads: Partial<INotification> = {},
): INotification => ({
  _created: faker.date.past().toString(),
  _id: faker.database.mongodbObjectId(),
  notified: faker.datatype.boolean(),
  read: faker.datatype.boolean(),
  triggeredBy: {
    displayName: faker.person.fullName(),
    userId: faker.internet.userName(),
  },
  type: faker.helpers.arrayElement(NotificationTypes),
  relevantUrl: faker.internet.url(),
  ...userOverloads,
})
