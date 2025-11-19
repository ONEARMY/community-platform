import { faker } from '@faker-js/faker';

export const questions = [
  {
    created_at: new Date().toUTCString(),
    deleted: false,
    comment_count: 3,
    description: 'test info with a link to https://www.onearmy.earth/',
    slug: 'the-first-test-question',
    title: 'The first test question?',
    total_views: 3,
  },
  {
    created_at: new Date().toUTCString(),
    created_by: 'demo_user',
    deleted: false,
    comment_count: 3,
    description: 'This is a test mock for the filtering question.',
    slug: 'filtering-question',
    title: 'The Filtering Question',
    total_views: 43,
  },
  {
    created_at: new Date().toUTCString(),
    deleted: false,
    comment_count: 0,
    description: "What's the deal with screenings?",
    slug: 'whats-the-deal-with-screenings',
    title: 'Intro screenings question',
    total_views: 1,
  },
];

for (let i = 0; i < 20; i++) {
  questions.push({
    created_at: faker.date.past().toUTCString(),
    deleted: false,
    comment_count: 12,
    description: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    title: faker.lorem.sentence(),
    total_views: faker.number.int(),
  });
}
