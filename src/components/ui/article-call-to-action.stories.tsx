import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from '@theme-ui/core';
import { Button, UsefulStatsButton } from 'oa-components';
import type { Author } from 'oa-shared';
import { theme } from 'oa-themes';
import type { ReactNode } from 'react';
import { ArticleCallToAction } from './article-call-to-action';

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

// The app still passes the oa-components Button and UsefulStatsButton as
// children here, and UsefulStatsButton reads the theme-ui theme directly. This
// Storybook has no theme-ui provider, so the stories supply one locally to
// render the real controls rather than stand-ins.
const WithLegacyTheme = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const meta: Meta<typeof ArticleCallToAction> = {
  title: 'ui/ArticleCallToAction',
  component: ArticleCallToAction,
};
export default meta;

type Story = StoryObj<typeof ArticleCallToAction>;

/**
 * The engagement controls come from the call site as `children`. The app still
 * passes the oa-components Button and UsefulStatsButton here, so these stories
 * use the same ones the legacy story did.
 */
export const CommentAndUseful: Story = {
  render: () => (
    <WithLegacyTheme>
      <ArticleCallToAction author={makeFakeUser()}>
        <Button sx={{ fontSize: 2 }}>Leave a comment</Button>
        <UsefulStatsButton
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
        <UsefulStatsButton
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
