import { faker } from '@faker-js/faker'

import { Button } from '../Button/Button'
import { LoggedOutWithCount } from '../UsefulStatsButton/UsefulStatsButton.stories'
import { ArticleCallToActionSupabase } from './ArticleCallToActionSupabase'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { Author } from 'oa-shared'

export default {
  title: 'Layout/ArticleCallToActionSupabase',
  component: ArticleCallToActionSupabase,
} as Meta<typeof ArticleCallToActionSupabase>

export const ArticleCallToActionSupabaseCommentAndUseful: StoryFn<
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

export const ArticleCallToActionSupabaseUseful: StoryFn<
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
        isVerified: faker.datatype.boolean(),
        isSupporter: faker.datatype.boolean(),
        photoUrl: faker.image.imageUrl(),
        username: faker.internet.userName(),
      },
    ]}
  >
    <Button>Action</Button>
  </ArticleCallToActionSupabase>
)

const makeFakeUser = (): Author => ({
  id: faker.datatype.number(),
  country: faker.address.countryCode(),
  displayName: faker.name.firstName(),
  isVerified: faker.datatype.boolean(),
  isSupporter: faker.datatype.boolean(),
  photoUrl: faker.image.imageUrl(),
  username: faker.internet.userName(),
})

export const ArticleCallToActionSupabaseMultipleContributors: StoryFn<
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
