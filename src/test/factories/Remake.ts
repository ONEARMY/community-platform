import { faker } from '@faker-js/faker';
import type { Author, MediaWithPublicUrl } from 'oa-shared';
import { Remake } from 'oa-shared';

export const FactoryRemakeImage = (
  overloads: Partial<MediaWithPublicUrl> = {},
): MediaWithPublicUrl => ({
  id: faker.string.uuid(),
  path: faker.system.filePath(),
  fullPath: faker.system.filePath(),
  publicUrl: faker.image.url(),
  ...overloads,
});

export const FactoryRemakeAuthor = (overloads: Partial<Author> = {}): Author =>
  ({
    id: faker.number.int(),
    displayName: faker.person.fullName(),
    username: faker.internet.username(),
    photo: null,
    country: 'Portugal',
    ...overloads,
  }) as Author;

export const FactoryRemake = (overloads: Partial<Remake> = {}): Remake =>
  new Remake({
    id: faker.number.int(),
    createdAt: faker.date.past(),
    modifiedAt: null,
    projectId: faker.number.int(),
    description: faker.lorem.paragraph(),
    images: [FactoryRemakeImage()],
    author: FactoryRemakeAuthor(),
    ...overloads,
  });
