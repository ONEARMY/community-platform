jest.mock('../common/module.store')
import { FactoryMessage } from 'src/test/factories/Message'
import { MessageStore } from './message.store'

const factory = () => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  const store = new MessageStore()

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

  it('should return an error when updating a message failsgst', async () => {
    const { store, getWhereFn, setFn } = factory()
    const msg = FactoryMessage()

    getWhereFn.mockResolvedValueOnce([])

    setFn.mockRejectedValueOnce(new Error('Error'))

    const res = await store.upload(msg)

    expect(res).toEqual(new Error('Error'))
  })
})
