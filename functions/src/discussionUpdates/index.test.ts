const admin = require('firebase-admin')

const test = require('firebase-functions-test')()

import { v4 as uuid } from 'uuid'

import { DB_ENDPOINTS } from '../models'
import { handleDiscussionUpdate } from './index'
import { IUserDB } from 'oa-shared/models/user'

describe('discussionUpdates', () => {
  let db
  beforeAll(async () => {
    db = await admin.firestore()
  })
  afterAll(test.cleanup)

  function stubbedDiscussionSnapshot(discussionId, props) {
    return test.firestore.makeDocumentSnapshot(
      {
        _id: discussionId,
        comments: [],
        ...props,
      },
      DB_ENDPOINTS.discussions,
    )
  }

  describe('updateDocuments', () => {
    it('create comment', async () => {
      // Arrange
      const userId = uuid()
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      // create fake user
      await db.collection(DB_ENDPOINTS.users).add({
        userName: userId,
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                parentCommentId: null,
              },
            ],
          }),
        ),
      )

      // Assert
      const doc = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', userId)
          .get()
      ).docs[0].data() as IUserDB

      expect(doc.stats.userCreatedComments).toHaveProperty(commentId, null)
    })

    it('delete comment', async () => {
      // Arrange
      const userId = uuid()
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      // create fake user
      await db.collection(DB_ENDPOINTS.users).add({
        userName: userId,
      })

      // Act
      // Add comment
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                parentCommentId: null,
              },
            ],
          }),
        ),
      )

      // Remove comment
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                parentCommentId: null,
              },
            ],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            comments: [],
          }),
        ),
      )

      // Assert
      const doc = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', userId)
          .get()
      ).docs[0].data() as IUserDB

      expect(doc.stats.userCreatedComments).not.toHaveProperty(commentId)
    })
  })
})
