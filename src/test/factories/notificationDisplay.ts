import { faker } from '@faker-js/faker';
import type { NotificationDisplay } from 'oa-shared';

export const factoryNotificationDisplay = (
  overloads: Partial<NotificationDisplay> = {},
): NotificationDisplay =>
  ({
    id: faker.number.int(),
    isRead: false,
    contentType: 'comments',
    email: {
      body: undefined,
      content: null,
      buttonLabel: 'See the full discussion',
      displayDate: faker.date.past().toDateString(),
      preview: 'Jeff has left a new comment',
      subject: 'A new comment on something',
      heroImage: undefined,
    },
    sidebar: { icon: 'comment', image: faker.image.avatar() },
    title: 'left a comment on Title',
    triggeredBy: faker.internet.username(),
    date: faker.date.past(),
    body: faker.lorem.sentence(),
    link: '/redirect?id=1&ct=comments',
    ...overloads,
  }) as NotificationDisplay;
