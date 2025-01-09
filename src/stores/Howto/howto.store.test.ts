import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')
import {
  FactoryHowto,
  FactoryHowtoDraft,
  FactoryHowtoStep,
} from 'src/test/factories/Howto'
import { FactoryUser } from 'src/test/factories/User'

import { HowtoStore } from './howto.store'

import type { ILibrary, IUser } from 'oa-shared'
import type { IRootStore } from '../RootStore'

const mockGetDoc = vi.fn()
const mockIncrement = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  doc: vi.fn(),
  getDoc: (doc) => mockGetDoc(doc),
  increment: (value) => mockIncrement(value),
}))

const factory = async (
  howTos: ILibrary.DB[] = [FactoryHowto({})],
  userOverloads?: Partial<IUser>,
) => {
  const store = new HowtoStore({} as IRootStore)

  const howToItem = howTos[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(
    FactoryUser({
      _id: 'fake-user',
      ...userOverloads,
    }),
  )

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
  store.db.get.mockResolvedValue(howToItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockReturnValue([howToItem])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    getUserProfile: vi.fn().mockImplementation((userName) =>
      FactoryUser({
        _authID: 'userId',
        userName,
      }),
    ),
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userNotificationsStore = {
    triggerNotification: vi.fn(),
  }

  store.toggleUsefulByUser = vi.fn()

  return {
    store,
    howToItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updateFn: store.db.update,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getFn: store.db.get,
  }
}

describe('howto.store', () => {
  describe('uploadHowTo', () => {
    it('creates a draft when only a title is provided', async () => {
      const howtos = [FactoryHowtoDraft({})]
      const { store, howToItem, setFn } = await factory(howtos)

      await store.uploadHowTo(howToItem)

      const [newHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newHowto.title).toBe('Quick draft')
    })

    it('updates an existing item', async () => {
      const { store, setFn } = await factory([
        FactoryHowto({
          _created: '2020-01-01T00:00:00.000Z',
          votedUsefulBy: ['fake-user', 'fake-user2'],
        }),
      ])

      const howto = FactoryHowtoDraft({})
      await store.uploadHowTo(howto)

      const [originalHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(originalHowto.title).toBe('Quick draft')

      const updatedHowtos = FactoryHowtoDraft({
        _id: originalHowto._id,
        steps: [FactoryHowtoStep(), FactoryHowtoStep(), FactoryHowtoStep()],
      })

      await store.uploadHowTo(updatedHowtos)

      const [finalHowto] = setFn.mock.calls[1]
      expect(setFn).toHaveBeenCalledTimes(2)
      expect(setFn).toHaveBeenCalledWith(
        expect.objectContaining({
          _created: '2020-01-01T00:00:00.000Z',
          votedUsefulBy: ['fake-user', 'fake-user2'],
        }),
        expect.anything(),
      )
      expect(finalHowto.steps).toHaveLength(3)
    })

    it('captures mentions within description', async () => {
      const howtos = [
        FactoryHowto({
          description: '@username',
        }),
      ]
      const { store, howToItem, setFn } = await factory(howtos)

      // Act
      await store.uploadHowTo(howToItem)

      const [newHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newHowto.description).toBe('@@{userId:username}')
      expect(newHowto.mentions).toHaveLength(1)
    })

    it('captures mentions within a how-step', async () => {
      const howtos = [
        FactoryHowto({
          steps: [
            FactoryHowtoStep({
              text: 'Step description featuring a @username',
            }),
          ],
        }),
      ]
      const { store, howToItem, setFn } = await factory(howtos)

      // Act
      await store.uploadHowTo(howToItem)

      const [newHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newHowto.steps[0].text).toBe(
        'Step description featuring a @@{userId:username}',
      )
      expect(newHowto.mentions).toHaveLength(1)
    })
  })

  describe('deleteHowTo', () => {
    it('handles legacy docs without previousSlugs', async () => {
      const howtoDoc = FactoryHowto({})
      howtoDoc.previousSlugs = []
      const { store, howToItem, setFn, getFn } = await factory([howtoDoc])

      // Act
      await store.deleteHowTo(howToItem._id)

      // Assert
      const [deletedHowTo] = setFn.mock.calls[0]

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(getFn).toHaveBeenCalledTimes(2)
      expect(getFn).toHaveBeenCalledWith('server')
      expect(deletedHowTo._deleted).toBeTruthy()
    })

    it('updates _deleted property after confirming delete', async () => {
      const { store, howToItem, setFn, getFn } = await factory()

      // Act
      await store.deleteHowTo(howToItem._id)

      // Assert
      const [deletedHowTo] = setFn.mock.calls[0]

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(getFn).toHaveBeenCalledTimes(2)
      expect(getFn).toHaveBeenCalledWith('server')
      expect(deletedHowTo._deleted).toBeTruthy()
    })
  })

  describe('incrementDownloadCount', () => {
    it('increments download count by one', async () => {
      const { store, howToItem, setFn } = await factory()

      const downloads = howToItem.total_downloads!
      // Act
      const updatedDownloads = await store.incrementDownloadCount(howToItem._id)

      expect(setFn).toBeCalledTimes(1)
      expect(updatedDownloads).toBe(downloads + 1)
    })
  })
})
