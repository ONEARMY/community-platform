const admin = require('firebase-admin')

const test = require('firebase-functions-test')()

import { v4 as uuid } from 'uuid'

import { DB_ENDPOINTS } from '../models'
import { handleDiscussionUpdate } from './index'

import type { IUserDB } from '../models'

describe('discussionUpdates', () => {
  let db
  beforeAll(async () => {
    db = await admin.firestore()
  })
  afterAll(async () => {
    await test.cleanup()
  })

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

  async function createFakeResearch(props) {
    const researchId = uuid()
    await db
      .collection(DB_ENDPOINTS.research)
      .doc(researchId)
      .set({
        _id: researchId,
        ...props,
      })
    return researchId
  }

  async function createFakeUser(props) {
    const userId = uuid()
    await db
      .collection(DB_ENDPOINTS.users)
      .doc(userId)
      .set({
        _id: userId,
        userName: userId,
        displayName: userId,
        ...props,
      })
    return userId
  }

  async function createFakeQuestion(props) {
    const questionId = uuid()
    await db
      .collection(DB_ENDPOINTS.questions)
      .doc(questionId)
      .set({
        _id: questionId,
        ...props,
      })
    return questionId
  }

  describe('updateDocuments', () => {
    it('create comment', async () => {
      // Arrange
      const userId = await createFakeUser({})
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: 'nonexisting',
            sourceId: 'nonexisting',
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: 'nonexisting',
            sourceId: 'nonexisting',
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
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
      const userId = await createFakeUser({})
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      // Act
      // Add comment
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: 'nonexisting',
            sourceId: 'nonexisting',
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: 'nonexisting',
            sourceId: 'nonexisting',
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
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
            sourceType: 'researchUpdate',
            sourceId: 'nonexisting',
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
                parentCommentId: null,
              },
            ],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            sourceId: 'nonexisting',
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

    it('create comment and notify content creator - research', async () => {
      // Arrange
      const userId = await createFakeUser({})
      const researchCreatorUserId = await createFakeUser({})
      const collaboratorId = await createFakeUser({})
      const updateId = uuid()
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      const researchId = await createFakeResearch({
        title: 'Fake Research',
        slug: 'fake-research',
        _createdBy: researchCreatorUserId,
        updates: [
          {
            _id: updateId,
            collaborators: [collaboratorId],
          },
        ],
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: researchId,
            sourceId: updateId,
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: researchId,
            sourceId: updateId,
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
                parentCommentId: null,
              },
            ],
          }),
        ),
      )

      // Assert
      const researchCreator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', researchCreatorUserId)
          .get()
      ).docs[0].data() as IUserDB

      expect(researchCreator.notifications).toHaveLength(1)
      expect(researchCreator.notifications[0].relevantUrl).toContain(
        'fake-research',
      )
      expect(researchCreator.notifications[0].relevantUrl).toContain(commentId)

      const researchCollaborator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', collaboratorId)
          .get()
      ).docs[0].data() as IUserDB

      expect(researchCollaborator.notifications).toHaveLength(1)
      expect(researchCollaborator.notifications[0].relevantUrl).toContain(
        'fake-research',
      )
      expect(researchCollaborator.notifications[0].relevantUrl).toContain(
        commentId,
      )
    })

    it('create nested comment and notify parent comment creator - research', async () => {
      // Arrange
      const userId = await createFakeUser({})
      const parentCommentCreatorUserId = await createFakeUser({})
      const collaboratorId = await createFakeUser({})
      const updateId = uuid()
      const discussionId = uuid()
      const parentCommentId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      const researchId = await createFakeResearch({
        title: 'Fake Research',
        slug: 'fake-research',
        _createdBy: parentCommentCreatorUserId,
        updates: [
          {
            _id: updateId,
            collaborators: [collaboratorId],
          },
        ],
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: researchId,
            sourceId: updateId,
            comments: [
              {
                _id: parentCommentId,
                _creatorId: parentCommentCreatorUserId,
                creatorName: parentCommentCreatorUserId,
                parentCommentId: null,
              },
            ],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'researchUpdate',
            primaryContentId: researchId,
            sourceId: updateId,
            comments: [
              {
                _id: parentCommentId,
                _creatorId: parentCommentCreatorUserId,
                creatorName: parentCommentCreatorUserId,
                parentCommentId: null,
              },
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
                parentCommentId: parentCommentId,
              },
            ],
          }),
        ),
      )

      // Assert
      const parentCommentCreator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', parentCommentCreatorUserId)
          .get()
      ).docs[0].data() as IUserDB

      expect(parentCommentCreator.notifications).toHaveLength(1)
      expect(parentCommentCreator.notifications[0].relevantUrl).toContain(
        'fake-research',
      )
      expect(parentCommentCreator.notifications[0].relevantUrl).toContain(
        commentId,
      )

      const researchCollaborator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', collaboratorId)
          .get()
      ).docs[0].data() as IUserDB

      expect(researchCollaborator.notifications).toHaveLength(1)
      expect(researchCollaborator.notifications[0].relevantUrl).toContain(
        'fake-research',
      )
      expect(researchCollaborator.notifications[0].relevantUrl).toContain(
        commentId,
      )
    })

    it('create comment and notify content creator - question', async () => {
      // Arrange
      const userId = await createFakeUser({})
      const questionCreatorUserId = await createFakeUser({})
      const discussionId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      const questionId = await createFakeQuestion({
        title: 'Fake Question',
        slug: 'fake-question',
        _createdBy: questionCreatorUserId,
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'question',
            primaryContentId: questionId,
            sourceId: questionId,
            comments: [],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'question',
            primaryContentId: questionId,
            sourceId: questionId,
            comments: [
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
                parentCommentId: null,
              },
            ],
          }),
        ),
      )

      // Assert
      const questionCreator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', questionCreatorUserId)
          .get()
      ).docs[0].data() as IUserDB

      expect(questionCreator.notifications).toHaveLength(1)
      expect(questionCreator.notifications[0].relevantUrl).toContain(
        'fake-question',
      )
      expect(questionCreator.notifications[0].relevantUrl).toContain(commentId)
    })

    it('create nested comment and notify parent comment creator - question', async () => {
      // Arrange
      const userId = await createFakeUser({})
      const parentCommentCreatorUserId = await createFakeUser({})
      const discussionId = uuid()
      const parentCommentId = uuid()
      const commentId = uuid()
      const wrapped = test.wrap(handleDiscussionUpdate)

      const questionId = await createFakeQuestion({
        title: 'Fake Question',
        slug: 'fake-question',
        _createdBy: parentCommentCreatorUserId,
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'question',
            primaryContentId: questionId,
            sourceId: questionId,
            comments: [
              {
                _id: parentCommentId,
                _creatorId: parentCommentCreatorUserId,
                creatorName: parentCommentCreatorUserId,
                parentCommentId: null,
              },
            ],
          }),
          stubbedDiscussionSnapshot(discussionId, {
            sourceType: 'question',
            primaryContentId: questionId,
            sourceId: questionId,
            comments: [
              {
                _id: parentCommentId,
                _creatorId: parentCommentCreatorUserId,
                creatorName: parentCommentCreatorUserId,
                parentCommentId: null,
              },
              {
                _id: commentId,
                _creatorId: userId,
                creatorName: userId,
                parentCommentId: parentCommentId,
              },
            ],
          }),
        ),
      )

      // Assert
      const parentCommentCreator = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', parentCommentCreatorUserId)
          .get()
      ).docs[0].data() as IUserDB

      expect(parentCommentCreator.notifications).toHaveLength(1)
      expect(parentCommentCreator.notifications[0].relevantUrl).toContain(
        'fake-question',
      )
      expect(parentCommentCreator.notifications[0].relevantUrl).toContain(
        commentId,
      )
    })
  })
})
