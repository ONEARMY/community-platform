import { faker } from '@faker-js/faker'

import type { Question } from 'src/models/question.model'

export const FactoryQuestionItem = (
  questionOverloads: Partial<Question> = {},
): Question => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  modifiedAt: faker.date.past(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  tags: [
    {
      id: faker.number.int(),
      name: faker.lorem.words(1),
    },
    {
      id: faker.number.int(),
      name: faker.lorem.words(1),
    },
  ],
  author: {
    id: faker.number.int(),
    name: faker.internet.userName(),
    country: faker.location.countryCode(),
    isVerified: faker.datatype.boolean(),
    firebaseAuthId: faker.string.uuid(),
    photoUrl: faker.image.avatar(),
    username: faker.internet.userName(),
  },
  category: {
    created_at: new Date(),
    id: faker.number.int(),
    name: faker.lorem.words(1),
    type: 'questions',
  },
  images: [],
  subscriberCount: faker.number.int(),
  commentCount: faker.number.int(),
  totalViews: faker.number.int(),
  usefulCount: faker.number.int(),
  ...questionOverloads,
})
