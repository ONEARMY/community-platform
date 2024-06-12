import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')

import { toJS } from 'mobx'
import { FactoryComment } from 'src/test/factories/Comment'
import {
  FactoryResearchItem,
  FactoryResearchItemFormInput,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'

import { ResearchStore } from './research.store'

import type { IDiscussion } from 'src/models'
import type { IRootStore } from '../RootStore'

vi.mock('../../utils/helpers', async () => ({
  // Preserve the original implementation of other helpers
  ...(await vi.importActual('../../utils/helpers')),
  randomID: () => 'random-id',
}))

const mockGetDoc = vi.fn()
const mockIncrement = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  doc: vi.fn(),
  getDoc: (doc) => mockGetDoc(doc),
  increment: (value) => mockIncrement(value),
}))

const factoryResearchItem = async (researchItemOverloads: any = {}, ...rest) =>
  factory(FactoryResearchItem, researchItemOverloads, ...rest)

const factoryResearchItemFormInput = async (
  researchItemOverloads: any = {},
  ...rest
) => factory(FactoryResearchItemFormInput, researchItemOverloads, ...rest)

const factory = async (
  mockFn,
  researchItemOverloads: any = {},
  activeUser = FactoryUser({
    _id: 'fake-user',
  }),
) => {
  const researchItem = mockFn({
    updates: [FactoryResearchItemUpdate(), FactoryResearchItemUpdate()],
    ...researchItemOverloads,
  })
  const store = new ResearchStore({} as IRootStore)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(activeUser)

  let item = researchItem

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.set.mockImplementation((newValue) => {
    item = newValue
    return newValue
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.update.mockImplementation((newValue) => {
    item = newValue
    return newValue
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockImplementation(async () => item)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockReturnValue([researchItem])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    getUserProfile: vi.fn().mockResolvedValue(
      FactoryUser({
        _authID: 'userId',
        userName: 'username',
      }),
    ),
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userNotificationsStore = {
    triggerNotification: vi.fn(),
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.discussionStore = {
    fetchOrCreateDiscussionBySource: vi.fn().mockResolvedValue({
      comments: [],
    }),
    addComment: vi
      .fn()
      .mockImplementation((_discussionObjec: IDiscussion, text: string) => {
        return {
          comments: [
            FactoryComment({
              _id: 'random-id',
              text,
            }),
          ],
        }
      }),
    editComment: vi.fn(),
    deleteComment: vi.fn(),
  }

  await store.setActiveResearchItemBySlug('fish')

  return {
    store,
    researchItem,
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

describe('research.store', () => {
  describe('Updates', () => {
    describe('uploadUpdate', () => {
      it('inserts a new update', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()
        const newUpdate = FactoryResearchItemUpdate()

        // Act
        await store.uploadUpdate(newUpdate)

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates.length).toBeGreaterThan(
          researchItem.updates.length,
        )
        expect(
          newResearchItem.updates.find(
            ({ title }) => title === newUpdate.title,
          ),
        ).toBeTruthy()
      })

      it('updates an existing update', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()
        const editedUpdate = toJS(researchItem.updates[0])

        // Act
        await store.uploadUpdate(editedUpdate)

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates.length).toEqual(
          researchItem.updates.length,
        )
        expect(
          newResearchItem.updates.find(
            ({ title }) => title === editedUpdate.title,
          ),
        ).toBeTruthy()
      })

      it('increment download count of research update media', async () => {
        const { store, researchItem } = await factoryResearchItem()
        const update = toJS(researchItem.updates[0])

        await store.uploadUpdate(update)

        const count = await store.incrementDownloadCount(update._id)
        expect(count).toBe(1)
      })

      it('preserves @mention within Research description', async () => {
        const { store, setFn } = await factoryResearchItem({
          description: '@username',
        })

        // Act
        await store.uploadUpdate(FactoryResearchItemUpdate())

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention within an existing Update description', async () => {
        const { store, setFn } = await factoryResearchItem({
          description: '@username',
          updates: [
            FactoryResearchItemUpdate({
              description: '@username',
            }),
          ],
        })

        // Act
        await store.uploadUpdate(FactoryResearchItemUpdate())

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].description).toBe(
          '@@{userId:username}',
        )
      })
    })

    describe('deleteUpdate', () => {
      it('removes an update', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()

        // Act
        await store.deleteUpdate(researchItem.updates[0]._id)

        // Assert
        expect(setFn).toBeCalledTimes(1)
        const [newResearchItem] = setFn.mock.calls[0]
        expect(
          newResearchItem.updates.find(
            ({ title }) => title === researchItem.updates[0].title,
          )._deleted,
        ).toBe(true)
      })

      it('handles malformed update id', async () => {
        const { store, setFn } = await factoryResearchItem()

        // Act
        await store.deleteUpdate('malformed-id')

        // Assert
        expect(setFn).not.toBeCalled()
      })
    })
  })

  describe('deleteResearch', () => {
    it('updates _deleted property after confirming delete', async () => {
      const { store, researchItem, setFn, getFn } = await factoryResearchItem()

      // Act
      await store.deleteResearch(researchItem._id)

      // Assert
      const [deletedResearchItem] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(getFn).toHaveBeenCalledTimes(3)
      expect(deletedResearchItem._deleted).toBeTruthy()
    })
  })

  describe('Item', () => {
    describe('uploadResearch', () => {
      it('adds @mention to Research description', async () => {
        const { store, researchItem, setFn } =
          await factoryResearchItemFormInput()

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          description: '@username',
        })

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
        expect(newResearchItem.mentions).toEqual(
          expect.arrayContaining([
            {
              location: 'description',
              username: 'username',
            },
          ]),
        )
      })

      it('triggers notifications for @mentions in Research description', async () => {
        const { store, researchItem } = await factoryResearchItemFormInput()

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          description: '@username',
        })

        // Assert
        expect(
          store.userNotificationsStore.triggerNotification,
        ).toBeCalledTimes(1)
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'research_mention',
          'username',
          `/research/${researchItem.slug}#description`,
          researchItem.title,
        )
      })

      it('does not trigger notifications for existing @mentions in Research description', async () => {
        const { store, researchItem } = await factoryResearchItem({
          mentions: [
            {
              username: 'username',
              location: 'description',
            },
          ],
        })

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          description: '@username',
        })

        // Assert
        expect(
          store.userNotificationsStore.triggerNotification,
        ).not.toBeCalled()
      })

      it('preserves @mention on existing Update description', async () => {
        const { store, researchItem, setFn } =
          await factoryResearchItemFormInput({
            _createdBy: 'fake-user',
            updates: [
              FactoryResearchItemUpdate({
                description: '@username',
              }),
            ],
          })

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          description: 'Edited description',
        })

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalled()
        expect(newResearchItem.updates[0].description).toBe(
          '@@{userId:username}',
        )
        expect(newResearchItem.mentions).toEqual(
          expect.arrayContaining([
            {
              location: `update-0`,
              username: 'username',
            },
          ]),
        )
      })

      it('formats collaborators', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({})

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          collaborators: 'abc,def',
        } as any)

        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalled()
        expect(newResearchItem.collaborators).toEqual(['abc', 'def'])
      })

      it('handles undefined collaborators', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          collaborators: undefined,
        } as any)

        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalled()
        expect(newResearchItem.collaborators).toEqual([])
      })

      it('handles empty collaborators', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          collaborators: ' , ,, ',
        } as any)

        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalled()
        expect(newResearchItem.collaborators).toEqual([])
      })
    })
  })

  describe('incrementViews', () => {
    it('increments views by one', async () => {
      const { store, researchItem, updateFn } = await factoryResearchItem()

      // Act
      await store.incrementViewCount(researchItem)
      const updatedTotalViews = researchItem.total_views + 1

      expect(updateFn).toHaveBeenCalledWith(
        expect.objectContaining({ total_views: updatedTotalViews }),
        expect.anything(),
      )
    })
  })

  describe('Subscribe', () => {
    it('adds subscriber to the research article', async () => {
      const { store, researchItem, updateFn } =
        await factoryResearchItemFormInput({
          subscribers: ['existing-subscriber'],
        })

      // Act
      await store.addSubscriberToResearchArticle(
        researchItem._id,
        'an-interested-user',
      )

      // Assert
      expect(updateFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = updateFn.mock.calls[0]
      expect(newResearchItem).toEqual(
        expect.objectContaining({
          subscribers: expect.arrayContaining([
            'an-interested-user',
            'existing-subscriber',
          ]),
        }),
      )
    })

    it('removes subscriber from the research article', async () => {
      const { store, researchItem, updateFn } =
        await factoryResearchItemFormInput({
          subscribers: ['long-term-subscriber', 'remove-me'],
        })

      // Act
      await store.removeSubscriberFromResearchArticle(
        researchItem._id,
        'remove-me',
      )

      // Assert
      expect(updateFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = updateFn.mock.calls[0]
      expect(newResearchItem).toEqual(
        expect.objectContaining({
          subscribers: ['long-term-subscriber'],
        }),
      )
    })

    it('triggers a notification for each subscribed users', async () => {
      const { store, researchItem, setFn } = await factoryResearchItem({
        subscribers: ['subscriber'],
      })

      // Act
      await store.uploadUpdate(FactoryResearchItemUpdate())
      await store.uploadUpdate(FactoryResearchItemUpdate())

      // Assert
      expect(setFn).toHaveBeenCalledTimes(2)

      expect(store.userNotificationsStore.triggerNotification).toBeCalledTimes(
        2,
      )
      expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
        'research_update',
        'subscriber',
        `/research/${researchItem.slug}`,
        researchItem.title,
      )
    })

    it('matches subscriber state for logged in user', async () => {
      const { store } = await factoryResearchItem(
        {
          subscribers: ['subscriber'],
        },
        FactoryUser({
          _id: 'fake-user-id',
          userName: 'subscriber',
        }),
      )

      // Assert
      expect(store.userHasSubscribed).toBe(true)
    })

    it('does not match subscriber state for logged in user', async () => {
      const { store } = await factoryResearchItem(
        {
          subscribers: ['subscriber'],
        },
        FactoryUser({
          userName: 'another-user',
        }),
      )

      // Assert
      expect(store.userHasSubscribed).toBe(false)
    })
  })
})
