const admin = require('firebase-admin')

const test = require('firebase-functions-test')()

import { v4 as uuid } from 'uuid'

import { DB_ENDPOINTS } from '../models'
import {
  handleQuestionCreate,
  handleQuestionUpdate,
  handleQuestionDelete,
} from './index'

import type { IUserDB } from '../models'

describe('questionUpdates', () => {
  let db
  beforeAll(async () => {
    db = await admin.firestore()
  })
  afterAll(test.cleanup)

  function stubbedQuestionSnapshot(questionId, props) {
    return test.firestore.makeDocumentSnapshot(
      {
        _id: questionId,
        moderation: 'accepted',
        ...props,
      },
      DB_ENDPOINTS.questions,
    )
  }

  describe('updateDocuments', () => {
    it('create question', async () => {
      // Arrange
      const userId = uuid()
      const questionId = uuid()
      const wrapped = test.wrap(handleQuestionCreate)

      // create fake user
      await db.collection(DB_ENDPOINTS.users).add({
        userName: userId,
      })

      // Act
      await wrapped(
        stubbedQuestionSnapshot(questionId, {
          _createdBy: userId,
        }),
      )

      // Assert
      const doc = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', userId)
          .get()
      ).docs[0].data() as IUserDB

      expect(doc.stats.userCreatedQuestions).toHaveProperty(
        questionId,
        'accepted',
      )
    })

    it('update question', async () => {
      // Arrange
      const userId = uuid()
      const questionId = uuid()
      const wrapped = test.wrap(handleQuestionUpdate)

      // create fake user
      await db.collection(DB_ENDPOINTS.users).add({
        userName: userId,
      })

      // Act
      await wrapped(
        await test.makeChange(
          stubbedQuestionSnapshot(questionId, {
            _createdBy: userId,
          }),
          stubbedQuestionSnapshot(questionId, {
            _createdBy: userId,
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

      expect(doc.stats.userCreatedQuestions).toHaveProperty(
        questionId,
        'accepted',
      )
    })

    it('delete question', async () => {
      // Arrange
      const userId = uuid()
      const questionId = uuid()
      const wrappedCreate = test.wrap(handleQuestionCreate)
      const wrappedDelete = test.wrap(handleQuestionDelete)

      // create fake user
      await db.collection(DB_ENDPOINTS.users).add({
        userName: userId,
      })

      // Act
      // add to stats
      await wrappedCreate(
        stubbedQuestionSnapshot(questionId, {
          _createdBy: userId,
        }),
      )
      // delete from stats
      await wrappedDelete(
        stubbedQuestionSnapshot(questionId, {
          _createdBy: userId,
        }),
      )

      // Assert
      const doc = (
        await db
          .collection(DB_ENDPOINTS.users)
          .where('userName', '==', userId)
          .get()
      ).docs[0].data() as IUserDB

      expect(doc.stats.userCreatedQuestions).not.toHaveProperty(
        questionId,
        'accepted',
      )
    })
  })
})
