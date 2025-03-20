import { faker } from '@faker-js/faker'

import { Button } from '../Button/Button'
import { LoggedOutWithCount } from '../UsefulStatsButton/UsefulStatsButton.stories'
import { ArticleCallToActionSupabase } from './ArticleCallToActionSupabase'

import type { Meta, StoryFn } from '@storybook/react'
import type { Author } from 'oa-shared'

export default {
  title: 'Layout/ArticleCallToAction',
  component: ArticleCallToActionSupabase,
} as Meta<typeof ArticleCallToActionSupabase>

export const ArticleCallToActionCommentAndUseful: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase author={makeFakeUser()}>
    <Button sx={{ fontSize: 2 }}>Leave a comment</Button>
    <LoggedOutWithCount
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={function (): Promise<void> {
        throw new Error('Function not implemented.')
      }}
    />
  </ArticleCallToActionSupabase>
)

export const ArticleCallToActionUseful: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase author={makeFakeUser()}>
    <LoggedOutWithCount
      isLoggedIn={false}
      hasUserVotedUseful={false}
      votedUsefulCount={0}
      onUsefulClick={function (): Promise<void> {
        throw new Error('Function not implemented.')
      }}
    />
  </ArticleCallToActionSupabase>
)

export const ArticleCallToActionSingleContributor: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase
    author={makeFakeUser()}
    contributors={[
      {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        photoUrl: faker.image.imageUrl(),
        country: faker.address.countryCode(),
        username: faker.internet.userName(),
        isVerified: faker.datatype.boolean(),
        isSupporter: faker.datatype.boolean(),
      },
    ]}
  >
    <Button>Action</Button>
  </ArticleCallToActionSupabase>
)

const makeFakeUser = (): Author => ({
  id: faker.datatype.number(),
  name: faker.name.firstName(),
  photoUrl: faker.image.imageUrl(),
  country: faker.address.countryCode(),
  username: faker.internet.userName(),
  isVerified: faker.datatype.boolean(),
  isSupporter: faker.datatype.boolean(),
})

export const ArticleCallToActionMultipleContributors: StoryFn<
  typeof ArticleCallToActionSupabase
> = () => (
  <ArticleCallToActionSupabase
    author={makeFakeUser()}
    contributors={faker.helpers.uniqueArray(
      makeFakeUser,
      Math.floor(Math.random() * 10),
    )}
  >
    <Button>Action</Button>
  </ArticleCallToActionSupabase>
)
