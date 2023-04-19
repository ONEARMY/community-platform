import type { StoryFn, Meta } from '@storybook/react'
import { CommentList } from './CommentList'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/CommentList',
  component: CommentList,
} as Meta<typeof CommentList>

const createComments = (numberOfComments = 2, commentOverloads = {}) =>
  [...Array(numberOfComments).keys()].slice(0).map(() => ({
    _created: faker.date.past().toString(),
    creatorCountry: faker.address.countryCode().toLowerCase(),
    _creatorId: faker.internet.userName(),
    _id: faker.database.mongodbObjectId(),
    creatorName: faker.internet.userName(),
    isUserVerified: faker.datatype.boolean(),
    text: faker.lorem.text(),
    isEditable: faker.datatype.boolean(),
    ...commentOverloads,
  }))

export const Default: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createComments(2)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

export const Expandable: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={createComments(20)}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)

const highlightedCommentList = createComments(20, { isEditable: false })

export const Highlighted: StoryFn<typeof CommentList> = () => (
  <CommentList
    comments={highlightedCommentList}
    highlightedCommentId={
      highlightedCommentList[highlightedCommentList.length - 2]._id
    }
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)
