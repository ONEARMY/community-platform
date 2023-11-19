import type { Meta } from '@storybook/react'
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
    text: `Comment${faker.datatype.uuid()} ` + faker.lorem.text(),
    isEditable: faker.datatype.boolean(),
    ...commentOverloads,
  }))

export const Default = {
  args: {
    comments: createComments(2),
    articleTitle: 'Test article',
    handleDelete: () => Promise.resolve(),
    handleEditRequest: () => Promise.resolve(),
    handleEdit: () => Promise.resolve(),
    handleReply: () => Promise.resolve(),
    isLoggedIn: false,
  },
}

export const Expandable = {
  args: {
    comments: createComments(20),
    articleTitle: 'Test article',
    handleDelete: () => Promise.resolve(),
    handleEditRequest: () => Promise.resolve(),
    handleEdit: () => Promise.resolve(),
    handleReply: () => Promise.resolve(),
    isLoggedIn: false,
  },
}

const highlightedCommentList = createComments(20, { isEditable: false })

export const Highlighted = {
  args: {
    comments: highlightedCommentList,
    highlightedCommentId:
      highlightedCommentList[highlightedCommentList.length - 2]._id,
    articleTitle: 'Test article',
    handleDelete: () => Promise.resolve(),
    handleEditRequest: () => Promise.resolve(),
    handleEdit: () => Promise.resolve(),
    handleReply: () => Promise.resolve(),
    isLoggedIn: false,
  },
}

const createNestedComments = () => {
  const comments = createComments(2)
  ;(comments[0] as any).replies = createComments(3)

  return comments
}

export const WithReplies = {
  args: {
    comments: createNestedComments(),
    replies: createComments(3),
    articleTitle: 'Test article',
    handleDelete: () => Promise.resolve(),
    handleEditRequest: () => Promise.resolve(),
    handleEdit: () => Promise.resolve(),
    handleReply: () => Promise.resolve(),
    isLoggedIn: false,
  },
}

const createDeepNestedComments = () => {
  const comments = createComments(1)

  ;(comments[0] as any).replies = createComments(1)
  ;(comments[0] as any).replies[0].replies = createComments(1)
  ;(comments[0] as any).replies[0].replies[0].replies = createComments(1)

  return comments
}

export const WithDeepNestedReplies = {
  args: {
    comments: createDeepNestedComments(),
    replies: createComments(3),
    articleTitle: 'Test article',
    handleDelete: () => Promise.resolve(),
    handleEditRequest: () => Promise.resolve(),
    handleEdit: () => Promise.resolve(),
    handleReply: () => Promise.resolve(),
    isLoggedIn: false,
  },
}
