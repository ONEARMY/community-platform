import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')

// import { FactoryQuestionItem } from 'src/test/factories/Question'
import { FactoryUser } from 'src/test/factories/User'

import { QuestionStore } from './question.store'

import type { IRootStore } from '../RootStore'

const mockToggleDocSubscriber = vi.fn()
vi.mock('../common/toggleDocSubscriberStatusByUserName', () => {
  return {
    __esModule: true,
    toggleDocSubscriberStatusByUserName: () => mockToggleDocSubscriber(),
  }
})

const mockToggleDocUsefulByUser = vi.fn()
vi.mock('../common/toggleDocUsefulByUser', () => ({
  __esModule: true,
  toggleDocUsefulByUser: () => mockToggleDocUsefulByUser(),
}))

const factory = () => {
  const store = new QuestionStore({} as IRootStore)
  store.isTitleThatReusesSlug = vi.fn().mockResolvedValue(false)

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
      const { store, setFn } = factory()
      // TODO
      // const newQuestion = FactoryQuestionItem({
      //   title: 'So what is plastic?',
      //   author: undefined,
      // })

      // Act
      // await store.upsertQuestion(newQuestion)

      expect(setFn).toBeCalledWith(
        expect.objectContaining({
          _createdBy: store.activeUser?.userName,
        }),
      )
    })
  })

  describe('toggleSubscriberStatusByUserName', () => {
    it('calls the toggle subscriber function', async () => {
      // const { store } = factory()
      // const question = FactoryQuestionItem()

      // TODO
      // await store.toggleSubscriber(question._id, store.activeUser!._id)

      expect(mockToggleDocSubscriber).toHaveBeenCalled()
    })
  })

  describe('toggleUsefulByUser', () => {
    it('calls the toogle voted for function', async () => {
      // const { store } = factory()
      // const question = FactoryQuestionItem()

      // TODO
      // await store.toggleUsefulByUser(question._id, store.activeUser!._id)

      expect(mockToggleDocUsefulByUser).toHaveBeenCalled()
    })
  })
})
