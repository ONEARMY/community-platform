import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')
import { FactoryMessage } from 'src/test/factories/Message'
import { FactoryUser } from 'src/test/factories/User'

import { MessageStore } from './message.store'

import type { IRootStore } from '../RootStore'

const factory = (user?) => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  const store = new MessageStore({} as IRootStore)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.activeUser = user || FactoryUser()

  // @ts-ignore
  store.db.set.mockImplementation((newValue) => {
    return newValue
  })

  // @ts-ignore
  store.db.getWhere.mockImplementation(async () => {})

  return {
    store,
    // @ts-ignore
    setFn: store.db.set,
    // @ts-ignore
    getWhereFn: store.db.getWhere,
  }
  /* eslint-enable @typescript-eslint/ban-ts-comment */
}

describe('message.store', () => {
  it('should throw error if user has sent too many messages', async () => {
    const { store, getWhereFn } = factory()

    getWhereFn.mockResolvedValueOnce(new Array(100))

    expect(async () => {
      await store.upload(FactoryMessage())
    }).rejects.toThrowError('Too many messages')
  })

  it('should throw error if user is blocked from messaging', async () => {
    const blockedUser = FactoryUser({ isBlockedFromMessaging: true })
    const { getWhereFn, store } = factory(blockedUser)

    getWhereFn.mockResolvedValueOnce([])

    expect(async () => {
      await store.upload(FactoryMessage())
    }).rejects.toThrowError('Blocked from messaging')
  })

  it('should upload a new message', async () => {
    const { store, getWhereFn, setFn } = factory()
    const msg = FactoryMessage()

    getWhereFn.mockResolvedValueOnce([])

    await store.upload(msg)

    expect(setFn).toHaveBeenCalledWith({
      ...msg,
      isSent: false,
    })
  })

  it('should return an error when updating a message fails', async () => {
    const { store, getWhereFn, setFn } = factory()
    const msg = FactoryMessage()

    getWhereFn.mockResolvedValueOnce([])
    setFn.mockRejectedValueOnce(new Error('Error'))

    const res = await store.upload(msg)

    expect(res).toEqual(new Error('Error'))
  })
})
