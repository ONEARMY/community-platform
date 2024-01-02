jest.mock('../common/module.store')
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { QuestionStore } from './question.store'
import { FactoryUser } from 'src/test/factories/User'

const factory = async () => {
  const store = new QuestionStore()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.activeUser = FactoryUser()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.set.mockImplementation((newValue) => {
    return newValue
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.update.mockImplementation((newValue) => {
    return newValue
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockImplementation(async () => {})

  return {
    store,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getWhereFn: store.db.getWhere,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updateFn: store.db.update,
  }
}

describe('question.store', () => {
  describe('upsertQuestion', () => {
    it('assigns _createdBy', async () => {
      const { store, setFn } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
        _createdBy: undefined,
      })

      // Act
      await store.upsertQuestion(newQuestion)

      expect(setFn).toBeCalledWith(
        expect.objectContaining({
          _createdBy: store.activeUser?.userName,
        }),
      )
    })

    it('generates a slug', async () => {
      const { store, setFn } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
      })

      // Act
      await store.upsertQuestion(newQuestion)

      expect(setFn).toBeCalledWith(
        expect.objectContaining({
          title: newQuestion.title,
          slug: 'question-title',
        }),
      )
    })

    it('generates a unique slug', async () => {
      const { store, setFn, getWhereFn } = await factory()

      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
      })

      getWhereFn.mockResolvedValue([
        FactoryQuestionItem({
          slug: 'question-title',
        }),
      ])

      // Act
      await store.upsertQuestion(newQuestion)

      expect(setFn).toBeCalledWith(
        expect.objectContaining({
          title: newQuestion.title,
          slug: expect.stringMatching(/question-title-/),
        }),
      )
    })
  })

  describe('fetchQuestions', () => {
    it('handles empty response', async () => {
      const { store, getWhereFn } = await factory()

      getWhereFn.mockResolvedValue([])

      // Act
      const res = await store.fetchQuestions()

      expect(res).toStrictEqual([])
      expect(getWhereFn).toBeCalledWith('_deleted', '!=', 'true')
    })

    it('handles empty response', async () => {
      const { store, getWhereFn } = await factory()

      getWhereFn.mockResolvedValue([
        FactoryQuestionItem({
          slug: 'question-draft',
          _createdBy: 'author',
          moderation: 'draft',
        }),
        FactoryQuestionItem({
          slug: 'question-published',
          _createdBy: 'author',
          moderation: 'accepted',
        }),
      ])

      // Act
      const res = await store.fetchQuestions()
      expect(res.length).toEqual(1)
      expect(res[0]).toMatchObject({
        slug: 'question-published',
        _createdBy: 'author',
        moderation: 'accepted',
      })
    })
  })

  describe('fetchQuestionBySlug', () => {
    it('handles empty query response', async () => {
      const { store } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
      })

      // Act
      expect(await store.fetchQuestionBySlug(newQuestion.slug)).toBe(null)
    })

    it('returns a valid response', async () => {
      const { store, getWhereFn } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
      })

      getWhereFn.mockResolvedValue([newQuestion])

      // Act
      const questionDoc = await store.fetchQuestionBySlug(newQuestion.slug)

      expect(getWhereFn.mock.calls[0]).toEqual(['slug', '==', newQuestion.slug])
      expect(questionDoc).toStrictEqual(newQuestion)
    })
  })

  describe('toggleSubscriberStatusByUserName', () => {
    it('adds user to subscribers list', async () => {
      const { store, updateFn } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
        subscribers: [],
      })

      // Act
      await store.toggleSubscriberStatusByUserName(newQuestion._id, 'user1')

      expect(updateFn).toBeCalledWith(
        expect.objectContaining({
          _id: newQuestion._id,
          subscribers: ['user1'],
        }),
      )
    })
  })
})
