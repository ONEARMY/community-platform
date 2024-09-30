import { faker } from '@faker-js/faker'

import type { IMessage } from 'oa-shared'

export const FactoryMessage = (
  messageOverloads: Partial<IMessage> = {},
): IMessage => ({
  email: faker.internet.email(),
  text: faker.lorem.paragraph(2),
  toUserName: faker.internet.userName(),
  isSent: false,
  ...messageOverloads,
})
