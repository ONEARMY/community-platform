import { faker } from '@faker-js/faker';

import { Button } from '../Button/Button';
import { UsefulStatsButton } from '../UsefulStatsButton/UsefulStatsButton';
import { ArticleCallToActionSupabase } from './ArticleCallToActionSupabase';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { Author } from 'oa-shared';

export default {
  title: 'Layout/ArticleCallToActionSupabase',
  component: ArticleCallToActionSupabase,
} as Meta<typeof ArticleCallToActionSupabase>;

export const ArticleCallToActionSupabaseCommentAndUseful: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase author={makeFakeUser()}>
    <Button sx={{ fontSize: 2 }}>Leave a comment</Button>
    <UsefulStatsButton
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={() => Promise.resolve()}
    />
  </ArticleCallToActionSupabase>
);

export const ArticleCallToActionSupabaseUseful: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase author={makeFakeUser()}>
    <UsefulStatsButton
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={() => Promise.resolve()}
    />
  </ArticleCallToActionSupabase>
);

export const ArticleCallToActionSupabaseSingleContributor: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase
    author={makeFakeUser()}
    contributors={[
      {
        id: faker.datatype.number(),
        country: faker.address.countryCode(),
        displayName: faker.name.firstName(),
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
        photo: {
          id: faker.datatype.string(),
          publicUrl: faker.image.imageUrl(),
        },
        username: faker.internet.userName(),
      },
    ]}
  >
    <Button>Action</Button>
  </ArticleCallToActionSupabase>
);

const makeFakeUser = (): Author => ({
  id: faker.datatype.number(),
  country: faker.address.countryCode(),
  displayName: faker.name.firstName(),
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
  photo: {
    id: faker.datatype.string(),
    publicUrl: faker.image.imageUrl(),
  },
  username: faker.internet.userName(),
});

export const ArticleCallToActionSupabaseMultipleContributors: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase
    author={makeFakeUser()}
    contributors={faker.helpers.uniqueArray(makeFakeUser, Math.floor(Math.random() * 10))}
  >
    <Button>Action</Button>
  </ArticleCallToActionSupabase>
);
