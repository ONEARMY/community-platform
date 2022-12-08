import type { INotification } from 'src/models'
import { faker } from '@faker-js/faker'

export const FactoryNotification = (
  userOverloads: Partial<INotification> = {},
): INotification => ({
  _created: faker.date.past().toString(),
  _id: faker.datatype.uuid(),
  notified: faker.datatype.boolean(),
  read: faker.datatype.boolean(),
  triggeredBy: {
    displayName: faker.name.fullName(),
    userId: faker.internet.userName(),
  },
  type: faker.helpers.arrayElement([
    'howto_useful',
    'new_comment',
    'new_comment_research',
    'research_useful',
  ]),
  relevantUrl: `/`,
  ...userOverloads,
})

/**
 * Mock notification assortment
 * */
export const FactoryNotificationSample = () => [
  FactoryNotification({ read: true, notified: true }),
  FactoryNotification({ read: true, notified: true }),
  FactoryNotification({ read: true, notified: true }),

  FactoryNotification({ read: false, notified: false }),
  FactoryNotification({ read: false, notified: false }),

  FactoryNotification({ read: false, notified: true }),
]
