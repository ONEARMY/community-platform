jest.mock('../common/module.store')
import { QuestionStore } from './question.store'

const factory = async () => {
  const store = new QuestionStore()

  return {
    store,
  }
}

describe('question.store', () => {
  describe('Item', () => {
    it('upsertQuestion', async () => {
      const { store } = await factory()

      expect(store.upsertQuestion).toBeInstanceOf(Function)
    })
  })
})
