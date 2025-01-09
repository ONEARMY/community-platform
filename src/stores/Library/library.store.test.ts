import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')
import {
  FactoryLibraryItem,
  FactoryLibraryItemDraft,
  FactoryLibraryItemStep,
} from 'src/test/factories/Library'
import { FactoryUser } from 'src/test/factories/User'

import { LibraryStore } from './library.store'

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
  items: ILibrary.DB[] = [FactoryLibraryItem({})],
  userOverloads?: Partial<IUser>,
) => {
  const store = new LibraryStore({} as IRootStore)

  const libraryItem = items[0]

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
  store.db.get.mockResolvedValue(libraryItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockReturnValue([libraryItem])

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
    libraryItem,
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

describe('item.store', () => {
  describe('upload', () => {
    it('creates a draft when only a title is provided', async () => {
      const library = [FactoryLibraryItemDraft({})]
      const { store, libraryItem, setFn } = await factory(library)

      await store.upload(libraryItem)

      const [newItem] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newItem.title).toBe('Quick draft')
    })

    it('updates an existing item', async () => {
      const { store, setFn } = await factory([
        FactoryLibraryItem({
          _created: '2020-01-01T00:00:00.000Z',
          votedUsefulBy: ['fake-user', 'fake-user2'],
        }),
      ])

      const item = FactoryLibraryItemDraft({})
      await store.upload(item)

      const [originalItem] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(originalItem.title).toBe('Quick draft')

      const updatedItem = FactoryLibraryItemDraft({
        _id: originalItem._id,
        steps: [
          FactoryLibraryItemStep(),
          FactoryLibraryItemStep(),
          FactoryLibraryItemStep(),
        ],
      })

      await store.upload(updatedItem)

      const [finalItem] = setFn.mock.calls[1]
      expect(setFn).toHaveBeenCalledTimes(2)
      expect(setFn).toHaveBeenCalledWith(
        expect.objectContaining({
          _created: '2020-01-01T00:00:00.000Z',
          votedUsefulBy: ['fake-user', 'fake-user2'],
        }),
        expect.anything(),
      )
      expect(finalItem.steps).toHaveLength(3)
    })

    it('captures mentions within description', async () => {
      const items = [
        FactoryLibraryItem({
          description: '@username',
        }),
      ]
      const { store, libraryItem, setFn } = await factory(items)

      // Act
      await store.upload(libraryItem)

      const [newItem] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newItem.description).toBe('@@{userId:username}')
      expect(newItem.mentions).toHaveLength(1)
    })

    it('captures mentions within a how-step', async () => {
      const items = [
        FactoryLibraryItem({
          steps: [
            FactoryLibraryItemStep({
              text: 'Step description featuring a @username',
            }),
          ],
        }),
      ]
      const { store, libraryItem, setFn } = await factory(items)

      // Act
      await store.upload(libraryItem)

      const [newItem] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newItem.steps[0].text).toBe(
        'Step description featuring a @@{userId:username}',
      )
      expect(newItem.mentions).toHaveLength(1)
    })
  })

  describe('delete', () => {
    it('handles legacy docs without previousSlugs', async () => {
      const item = FactoryLibraryItem({})
      item.previousSlugs = []
      const { store, libraryItem, setFn, getFn } = await factory([item])

      // Act
      await store.delete(libraryItem._id)

      // Assert
      const [deletedItem] = setFn.mock.calls[0]

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(getFn).toHaveBeenCalledTimes(2)
      expect(getFn).toHaveBeenCalledWith('server')
      expect(deletedItem._deleted).toBeTruthy()
    })

    it('updates _deleted property after confirming delete', async () => {
      const { store, libraryItem, setFn, getFn } = await factory()

      // Act
      await store.delete(libraryItem._id)

      // Assert
      const [deletedItem] = setFn.mock.calls[0]

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(getFn).toHaveBeenCalledTimes(2)
      expect(getFn).toHaveBeenCalledWith('server')
      expect(deletedItem._deleted).toBeTruthy()
    })
  })

  describe('incrementDownloadCount', () => {
    it('increments download count by one', async () => {
      const { store, libraryItem, setFn } = await factory()

      const downloads = libraryItem.total_downloads!
      // Act
      const updatedDownloads = await store.incrementDownloadCount(
        libraryItem._id,
      )

      expect(setFn).toBeCalledTimes(1)
      expect(updatedDownloads).toBe(downloads + 1)
    })
  })
})
