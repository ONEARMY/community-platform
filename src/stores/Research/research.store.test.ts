jest.mock('../common/module.store')
import { toJS } from 'mobx'
import { UserRole } from 'oa-shared'
import { FactoryComment } from 'src/test/factories/Comment'
import {
  FactoryResearchItem,
  FactoryResearchItemFormInput,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'

import { ResearchStore } from './research.store'

import type { IDiscussion } from 'src/models'

jest.mock('../../utils/helpers', () => ({
  // Preserve the original implementation of other helpers
  ...jest.requireActual('../../utils/helpers'),
  randomID: () => 'random-id',
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
  const store = new ResearchStore()

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
    getUserProfile: jest.fn().mockResolvedValue(
      FactoryUser({
        _authID: 'userId',
        userName: 'username',
      }),
    ),
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userNotificationsStore = {
    triggerNotification: jest.fn(),
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.discussionStore = {
    fetchOrCreateDiscussionBySource: jest.fn().mockResolvedValue({
      comments: [],
    }),
    addComment: jest
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
    editComment: jest.fn(),
    deleteComment: jest.fn(),
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
  describe('Comments', () => {
    describe('fetchingCommments', () => {
      it('always returns an empty list', async () => {
        // Arrange
        // fetching a research item with comments
        const { store } = await factoryResearchItem()
        // Act
        // Assert
        const mockDiscussionFetch =
          store.discussionStore.fetchOrCreateDiscussionBySource
        expect(mockDiscussionFetch).toBeCalledTimes(
          store.activeResearchItem?.updates.length || 0,
        )
        expect(mockDiscussionFetch.mock.calls[0]).toEqual([
          expect.any(String),
          'researchUpdate',
        ])
        expect(store.activeResearchItem.updates[0].comments).toEqual([])
      })

      it('queries Discussions for comments', async () => {
        // Arrange
        // fetching a research item with comments
        const localComment = FactoryComment()
        const comment = FactoryComment()
        const { store } = await factoryResearchItem({
          updates: [FactoryResearchItemUpdate({ comments: [localComment] })],
        })
        store.discussionStore.fetchOrCreateDiscussionBySource.mockResolvedValue(
          {
            comments: [comment],
          },
        )

        // Act
        await store.setActiveResearchItemBySlug('fish')

        // Assert
        expect(store.activeResearchItem.updates[0].comments).toEqual([
          localComment,
          comment,
        ])
      })
    })

    describe('addComment', () => {
      it('adds new comment to update', async () => {
        const { store, researchItem, setFn, updateFn } =
          await factoryResearchItem({
            collaborators: ['a-contributor'],
            subscribers: ['subscriber'],
          })
        store.discussionStore.fetchOrCreateDiscussionBySource.mockResolvedValue(
          {
            comments: [FactoryComment()],
          },
        )

        // Act
        await store.addComment('fish', researchItem.updates[0], null)

        // Assert
        const [newResearchItem] = updateFn.mock.calls[0]

        expect(setFn).not.toBeCalled()
        expect(newResearchItem.totalCommentCount).toBe(1)

        // Notifies research author
        expect(
          store.userNotificationsStore.triggerNotification,
        ).toHaveBeenCalledTimes(2)
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'new_comment_discussion',
          researchItem._createdBy,
          `/research/${researchItem.slug}#update_0`,
          researchItem.title,
        )
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'new_comment_discussion',
          'a-contributor',
          `/research/${researchItem.slug}#update_0`,
          researchItem.title,
        )
        expect(store.discussionStore.addComment).toBeCalledWith(
          expect.any(Object),
          'fish',
          null,
        )
      })

      it('adds @mention to comment text', async () => {
        const { store, researchItem, setFn, updateFn } =
          await factoryResearchItem()

        // Act
        await store.addComment(
          'My favourite user has to be @username',
          researchItem.updates[0],
          null,
        )

        // Assert
        const [newResearchItem] = updateFn.mock.calls[0]
        expect(updateFn).toHaveBeenCalledTimes(1)
        expect(setFn).not.toBeCalled()
        expect(newResearchItem.totalCommentCount).toBe(1)
        expect(newResearchItem.mentions).toEqual(
          expect.arrayContaining([
            {
              username: 'username',
              location: 'update-0-comment:random-id',
            },
          ]),
        )
        expect(store.discussionStore.addComment).toBeCalledWith(
          expect.any(Object),
          'My favourite user has to be @username',
          null,
        )
      })
    })

    describe('deleteComment', () => {
      it('removes a comment', async () => {
        const { store, researchItem, setFn, updateFn } =
          await factoryResearchItem({
            totalCommentCount: -1,
            updates: [
              FactoryResearchItemUpdate({
                description: '@username',
                comments: [
                  FactoryComment({
                    _id: 'commentId',
                    _creatorId: 'fake-user',
                    text: 'text',
                  }),
                ],
              }),
            ],
          })

        // Act
        await store.deleteComment('commentId', researchItem.updates[0])

        // Assert
        const [newResearchItem] = updateFn.mock.calls[0]
        expect(updateFn).toHaveBeenCalledTimes(1)
        expect(setFn).not.toBeCalled()
        expect(newResearchItem.totalCommentCount).toBe(0)
        expect(store.discussionStore.deleteComment).toBeCalledWith(
          expect.any(Object),
          'commentId',
        )
      })

      it('admin removes another users comment', async () => {
        const { store, researchItem, updateFn } = await factoryResearchItem(
          {
            updates: [
              FactoryResearchItemUpdate({
                description: '@username',
                comments: [
                  FactoryComment({
                    _id: 'commentId',
                    _creatorId: 'fake-user',
                    text: 'text',
                  }),
                ],
              }),
            ],
          },
          FactoryUser({
            _id: 'test-user',
            userRoles: [UserRole.ADMIN],
          }),
        )

        // Act
        await store.deleteComment('commentId', researchItem.updates[0])

        // Assert
        expect(updateFn).toHaveBeenCalledTimes(1)
        expect(store.discussionStore.deleteComment).toBeCalledWith(
          expect.any(Object),
          'commentId',
        )
      })
    })

    describe('editComment', () => {
      it('updates a comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, updateFn } = await factoryResearchItem({
          updates: [
            FactoryResearchItemUpdate({
              comments: [comment],
            }),
          ],
        })

        // Act
        await store.editComment(
          comment._id,
          'My favourite comment',
          researchItem.updates[0],
        )

        // Assert
        const [newResearchItem] = updateFn.mock.calls[0]
        expect(newResearchItem.totalCommentCount).toBe(1)
        expect(store.discussionStore.editComment).toBeCalledWith(
          expect.any(Object),
          comment._id,
          'My favourite comment',
        )
      })

      it('admin updates another users comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, updateFn } = await factoryResearchItem(
          {
            updates: [
              FactoryResearchItemUpdate({
                comments: [comment],
              }),
            ],
          },
          FactoryUser({
            _id: 'test-user',
            userRoles: [UserRole.ADMIN],
          }),
        )

        // Act
        await store.editComment(
          comment._id,
          'My favourite comment',
          researchItem.updates[0],
        )

        // Assert
        const [newResearchItem] = updateFn.mock.calls[0]
        expect(newResearchItem.totalCommentCount).toBe(1)
        expect(store.discussionStore.editComment).toBeCalledWith(
          expect.any(Object),
          comment._id,
          'My favourite comment',
        )
      })

      // TODO: Handle notifications or should they be moved to Discussion?
      it.skip('triggers a notification when editing an comment to add @mention', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })
        const { store, researchItem, setFn } = await factoryResearchItem({
          updates: [
            FactoryResearchItemUpdate({
              description: 'Some description',
              comments: [comment],
            }),
          ],
        })

        // Act
        await store.editComment(
          comment._id,
          'My favourite comment @username',
          researchItem.updates[0],
        )

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(store.discussionStore.editComment).toBeCalledWith(
          expect.any(Object),
          comment._id,
          'My favourite comment @username',
        )
        expect(
          store.userNotificationsStore.triggerNotification,
        ).toBeCalledTimes(1)
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'research_mention',
          'username',
          `/research/${researchItem.slug}#update-0-comment:${newResearchItem.updates[0].comments[0]._id}`,
          researchItem.title,
        )
      })
    })
  })

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

  describe('Useful', () => {
    it('marks a research item as useful', async () => {
      const { store, researchItem, updateFn } =
        await factoryResearchItemFormInput({
          votedUsefulBy: ['existing-user'],
        })

      // Act
      await store.toggleUsefulByUser(researchItem._id, 'an-interested-user')

      // Assert
      expect(updateFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = updateFn.mock.calls[0]
      expect(newResearchItem).toEqual(
        expect.objectContaining({
          votedUsefulBy: expect.arrayContaining([
            'existing-user',
            'an-interested-user',
          ]),
        }),
      )
    })

    it('removes vote from a research item', async () => {
      const { store, researchItem, updateFn } =
        await factoryResearchItemFormInput({
          votedUsefulBy: ['uninterested-user', 'user'],
        })

      // Act
      await store.toggleUsefulByUser(researchItem._id, 'uninterested-user')

      // Assert
      expect(updateFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = updateFn.mock.calls[0]
      expect(newResearchItem).toEqual(
        expect.objectContaining({
          votedUsefulBy: ['user'],
        }),
      )
    })
  })

  describe('getters', () => {
    describe('commentsCount', () => {
      it('returns the total number of comments', async () => {
        const { store } = await factoryResearchItem({
          totalCommentCount: 3,
        })

        // Act
        store.setActiveResearchItemBySlug('fish')

        // Assert
        expect(store.commentsCount).toBe(3)
      })

      it('returns count from local items', async () => {
        const { store } = await factoryResearchItem({
          totalCommentCount: 3,
          updates: [
            FactoryResearchItemUpdate({
              comments: [FactoryComment(), FactoryComment(), FactoryComment()],
            }),
          ],
        })

        // Act
        store.setActiveResearchItemBySlug('fish')

        // Assert
        expect(store.commentsCount).toBe(6)
      })

      it('normalizes malformed values', async () => {
        const { store } = await factoryResearchItem({
          totalCommentCount: -1,
        })

        // Act
        store.setActiveResearchItemBySlug('fish')

        // Assert
        expect(store.commentsCount).toBe(0)
      })
    })
  })
})
