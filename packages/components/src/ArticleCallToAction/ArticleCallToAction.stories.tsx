import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { Button } from '../Button/Button'
import { LoggedOutWithCount } from '../UsefulStatsButton/UsefulStatsButton.stories'
import { ArticleCallToAction } from './ArticleCallToAction'

export default {
  title: 'Components/ArticleCallToAction',
  component: ArticleCallToAction,
} as Meta<typeof ArticleCallToAction>

export const ArticleCallToActionCommentAndUseful: StoryFn<
  typeof ArticleCallToAction
> = () => (
  <ArticleCallToAction author={makeFakeUser()}>
    <Button sx={{ fontSize: 2 }}>Leave a comment</Button>
    <LoggedOutWithCount
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={function (): void {
        throw new Error('Function not implemented.')
      }}
    />
  </ArticleCallToAction>
)

export const ArticleCallToActionUseful: StoryFn<
  typeof ArticleCallToAction
> = () => (
  <ArticleCallToAction author={makeFakeUser()}>
    <LoggedOutWithCount
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={function (): void {
        throw new Error('Function not implemented.')
      }}
    />
  </ArticleCallToAction>
)

export const ArticleCallToActionSingleContributor: StoryFn<
  typeof ArticleCallToAction
> = () => (
  <ArticleCallToAction
    author={makeFakeUser()}
    contributors={[
      {
        countryCode: faker.address.countryCode(),
        userName: faker.internet.userName(),
        isVerified: faker.datatype.boolean(),
      },
    ]}
  >
    <Button>Action</Button>
  </ArticleCallToAction>
)

const makeFakeUser = () => ({
  countryCode: faker.address.countryCode(),
  userName: faker.internet.userName(),
  isVerified: faker.datatype.boolean(),
})

export const ArticleCallToActionMultipleContributors: StoryFn<
  typeof ArticleCallToAction
> = () => (
  <ArticleCallToAction
    author={makeFakeUser()}
    contributors={faker.helpers.uniqueArray(
      makeFakeUser,
      Math.floor(Math.random() * 10),
    )}
  >
    <Button>Action</Button>
  </ArticleCallToAction>
)
