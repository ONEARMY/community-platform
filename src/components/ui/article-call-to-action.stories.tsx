import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from '@theme-ui/core';
import { Button } from 'oa-components';
import type { Author } from 'oa-shared';
import { theme } from 'oa-themes';
import type { ReactNode } from 'react';
import { ArticleCallToAction } from './article-call-to-action';
import { UsefulButton } from './useful-button';

const makeFakeUser = (): Author => ({
  id: faker.number.int(),
  country: faker.location.countryCode(),
  displayName: faker.person.firstName(),
  badges: [
    { id: 1, name: 'pro', displayName: 'PRO', imageUrl: faker.image.avatar() },
    {
      id: 2,
      name: 'supporter',
      displayName: 'Supporter',
      actionUrl: faker.internet.url(),
      imageUrl: faker.image.avatar(),
    },
  ],
  photo: { id: faker.string.uuid(), publicUrl: faker.image.avatar() },
  username: faker.internet.username(),
});

const WithLegacyTheme = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const meta: Meta<typeof ArticleCallToAction> = {
  title: 'ui/ArticleCallToAction',
  component: ArticleCallToAction,
};
export default meta;

type Story = StoryObj<typeof ArticleCallToAction>;

export const CommentAndUseful: Story = {
  render: () => (
    <WithLegacyTheme>
      <ArticleCallToAction author={makeFakeUser()}>
        <Button sx={{ fontSize: 2 }}>Leave a comment</Button>
        <UsefulButton
          isLoggedIn={false}
          hasUserVotedUseful={false}
          onUsefulClick={() => Promise.resolve()}
        />
      </ArticleCallToAction>
    </WithLegacyTheme>
  ),
};

export const Useful: Story = {
  render: () => (
    <WithLegacyTheme>
      <ArticleCallToAction author={makeFakeUser()}>
        <UsefulButton
          isLoggedIn={false}
          hasUserVotedUseful={false}
          onUsefulClick={() => Promise.resolve()}
        />
      </ArticleCallToAction>
    </WithLegacyTheme>
  ),
};

export const SingleContributor: Story = {
  render: () => (
    <WithLegacyTheme>
      <ArticleCallToAction author={makeFakeUser()} contributors={[makeFakeUser()]}>
        <Button sx={{ fontSize: 2 }}>Action</Button>
      </ArticleCallToAction>
    </WithLegacyTheme>
  ),
};

export const MultipleContributors: Story = {
  render: () => (
    <WithLegacyTheme>
      <ArticleCallToAction
        author={makeFakeUser()}
        contributors={faker.helpers.uniqueArray(makeFakeUser, 5)}
      >
        <Button sx={{ fontSize: 2 }}>Action</Button>
      </ArticleCallToAction>
    </WithLegacyTheme>
  ),
};
