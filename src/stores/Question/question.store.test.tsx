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

  return {
    store,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
  }
}

describe('question.store', () => {
  describe('Item', () => {
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
  })
})
