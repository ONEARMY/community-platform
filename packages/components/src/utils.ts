import { faker } from '@faker-js/faker';

import type {
  Author,
  Comment,
  News,
  NotificationDisplay,
  PinProfile,
  ProfileType,
  Question,
  ResearchItem,
  ResearchUpdate,
} from 'oa-shared';

export const fakeAuthorSB = (authorOverloads: Partial<Author> = {}): Author => ({
  id: faker.number.int(),
  country: faker.location.country(),
  displayName: faker.person.firstName(),
  username: faker.internet.username(),
  photo: {
    id: faker.string.uuid(),
    publicUrl: faker.image.avatar(),
  },
  badges: [],
  ...authorOverloads,
});

export const createFakeCommentsSB = (numberOfComments = 2, commentOverloads = {}): Comment[] =>
  [...Array(numberOfComments).keys()].slice(0).map(() =>
    fakeCommentSB({
      ...commentOverloads,
    }),
  );

export const fakeCommentSB = (commentOverloads: Partial<Comment> = {}): Comment => ({
  id: faker.number.int(100),
  createdAt: new Date(),
  modifiedAt: new Date(),
  createdBy: null,
  comment: faker.lorem.text(),
  sourceId: faker.number.int(100),
  sourceType: 'questions',
  parentId: faker.number.int(100),
  deleted: false,
  highlighted: false,
  replies: [],
  ...commentOverloads,
});

export const fakeNewsSB = (newsOverloads: Partial<News> = {}): News => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  category: null,
  commentCount: faker.number.int(100),
  deleted: false,
  title: faker.lorem.words(8),
  previousSlugs: [],
  slug: 'random-slug',
  subscriberCount: faker.number.int(20),
  summary: null,
  tags: [],
  totalViews: faker.number.int(100),
  usefulCount: faker.number.int(20),
  body: faker.word.words(50),
  bodyHtml: faker.word.words(50),
  heroImage: null,
  isDraft: false,
  profileBadge: null,
  ...newsOverloads,
});

export const fakeDisplayNotification = (
  notificationOverloads: Partial<NotificationDisplay> = {},
): NotificationDisplay => ({
  id: faker.number.int(),
  isRead: faker.datatype.boolean(),
  contentType: 'comment',
  email: {
    body: undefined,
    buttonLabel: 'See the full discussion',
    preview: 'Jeff has left a new comment',
    subject: 'A new comment on something',
  },
  sidebar: {
    icon: 'discussion',
    image: faker.image.avatar(),
  },
  title: `left a comment on Title`,
  triggeredBy: faker.internet.username(),
  date: faker.date.past(),
  body: faker.lorem.text(),
  link: 'comment',
  ...notificationOverloads,
});

export const fakeQuestionSB = (questionOverloads: Partial<Question> = {}): Question => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  category: null,
  commentCount: faker.number.int(100),
  description: faker.lorem.words(20),
  deleted: false,
  images: [],
  title: faker.lorem.words(8),
  previousSlugs: [],
  slug: 'random-slug',
  subscriberCount: faker.number.int(20),
  tags: [],
  totalViews: faker.number.int(100),
  usefulCount: faker.number.int(20),
  isDraft: false,
  ...questionOverloads,
});

export const fakeResearchItem = (
  researchItemOverloads: Partial<ResearchItem> = {},
): ResearchItem => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  category: null,
  collaborators: [],
  collaboratorsUsernames: [],
  commentCount: faker.number.int(100),
  deleted: false,
  description: faker.lorem.words(12),
  image: null,
  usefulCount: faker.number.int(20),
  title: faker.lorem.words(8),
  previousSlugs: [],
  slug: 'random-slug',
  subscriberCount: faker.number.int(20),
  status: 'in-progress',
  updateCount: 0,
  updates: [],
  tags: [],
  totalViews: faker.number.int(100),
  isDraft: false,
  ...researchItemOverloads,
});

export const fakeResearchUpdate = (
  researchItemOverloads: Partial<ResearchUpdate> = {},
): ResearchUpdate => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  researchId: faker.number.int(100),
  commentCount: faker.number.int(100),
  deleted: false,
  description: faker.lorem.words(12),
  images: [],
  files: null,
  fileDownloadCount: faker.number.int(100),
  isDraft: false,
  hasFileLink: false,
  videoUrl: null,
  title: faker.lorem.words(8),
  ...researchItemOverloads,
});

export const fakeProfileType = (profileTypeOverLoads: Partial<ProfileType> = {}): ProfileType => ({
  id: faker.number.int(),
  description: '',
  displayName: '',
  imageUrl: faker.image.avatar(),
  smallImageUrl: faker.image.avatar(),
  mapPinName: 'Wants to get started',
  name: 'Member',
  order: 0,
  isSpace: false,
  ...profileTypeOverLoads,
});

export const fakePinProfile = (pinProfileOverLoads: Partial<PinProfile> = {}): PinProfile => ({
  id: faker.number.int(),
  about: '',
  country: faker.location.country(),
  coverImages: null,
  displayName: faker.person.firstName(),
  username: faker.internet.username(),
  photo: {
    id: faker.string.uuid(),
    publicUrl: faker.image.avatar(),
  },
  type: fakeProfileType(),
  badges: [],
  visitorPolicy: null,
  isContactable: true,
  lastActive: new Date(),
  ...pinProfileOverLoads,
});
