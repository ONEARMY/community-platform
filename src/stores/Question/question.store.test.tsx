jest.mock('../common/module.store')
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { QuestionStore } from './question.store'

const factory = async () => {
  const store = new QuestionStore()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.set.mockImplementation((newValue) => {
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
  }
}

describe('question.store', () => {
  describe('upsertQuestion', () => {
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
  })

  describe('fetchQuestionBySlug', () => {
    it('queries DB based on slug', async () => {
      const { store, getWhereFn } = await factory()
      const newQuestion = FactoryQuestionItem({
        title: 'Question title',
      })

      // Act
      await store.fetchQuestionBySlug(newQuestion.slug)

      expect(getWhereFn.mock.calls[0]).toEqual(['slug', '==', newQuestion.slug])
    })
  })
})
