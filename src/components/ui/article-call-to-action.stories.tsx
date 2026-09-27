import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Author } from 'oa-shared';
import { ArticleCallToAction } from './article-call-to-action';
import { Button } from './button';

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

const meta: Meta<typeof ArticleCallToAction> = {
  title: 'ui/ArticleCallToAction',
  component: ArticleCallToAction,
};
export default meta;

type Story = StoryObj<typeof ArticleCallToAction>;

/** The engagement controls are supplied by the call site as `children`. */
export const CommentAndUseful: Story = {
  render: () => (
    <ArticleCallToAction author={makeFakeUser()}>
      <Button>Leave a comment</Button>
      <Button variant="outline">Useful</Button>
    </ArticleCallToAction>
  ),
};

export const SingleAction: Story = {
  render: () => (
    <ArticleCallToAction author={makeFakeUser()}>
      <Button variant="outline">Useful</Button>
    </ArticleCallToAction>
  ),
};

export const SingleContributor: Story = {
  render: () => (
    <ArticleCallToAction author={makeFakeUser()} contributors={[makeFakeUser()]}>
      <Button>Action</Button>
    </ArticleCallToAction>
  ),
};

export const MultipleContributors: Story = {
  render: () => (
    <ArticleCallToAction
      author={makeFakeUser()}
      contributors={faker.helpers.uniqueArray(makeFakeUser, 5)}
    >
      <Button>Action</Button>
    </ArticleCallToAction>
  ),
};
