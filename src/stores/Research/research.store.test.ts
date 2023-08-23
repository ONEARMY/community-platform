jest.mock('../common/module.store')
import { isObservable, observable, toJS } from 'mobx'
import { FactoryComment } from 'src/test/factories/Comment'
import {
  FactoryResearchItem,
  FactoryResearchItemFormInput,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { ResearchStore } from './research.store'

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

  await store.setActiveResearchItemBySlug('fish')

  return {
    store,
    researchItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getFn: store.db.get,
  }
}

describe('research.store', () => {
  describe('Comments', () => {
    describe('addComment', () => {
      it('does not pass observable to set', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
          collaborators: ['a-contributor'],
          subscribers: ['subscriber'],
          updates: [
            FactoryResearchItemUpdate({
              collaborators: observable(['a-contributor']),
            }),
            FactoryResearchItemUpdate({
              collaborators: observable(['a-contributor']),
            }),
          ],
        })

        // Act
        await store.addComment('fish', researchItem.updates[0])

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(isObservable(newResearchItem.updates[0].collaborators)).toBe(
          false,
        )
      })

      it('adds new comment to update', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
          collaborators: ['a-contributor'],
          subscribers: ['subscriber'],
        })

        // Act
        await store.addComment('fish', researchItem.updates[0])

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]

        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newResearchItem.updates[0].comments[0]).toEqual(
          expect.objectContaining({
            text: 'fish',
          }),
        )
        expect(newResearchItem.updates[1].comments).toBeUndefined()

        // Notifies research author
        expect(
          store.userNotificationsStore.triggerNotification,
        ).toHaveBeenCalledTimes(2)
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'new_comment_research',
          researchItem._createdBy,
          `/research/${researchItem.slug}#update_0`,
        )
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'new_comment_research',
          'a-contributor',
          `/research/${researchItem.slug}#update_0`,
        )
      })

      it('adds @mention to comment text', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem()

        // Act
        await store.addComment(
          'My favourite user has to be @username',
          researchItem.updates[0],
        )

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newResearchItem.updates[0].comments[0]).toEqual(
          expect.objectContaining({
            text: 'My favourite user has to be @@{userId:username}',
          }),
        )
        expect(newResearchItem.updates[1].comments).toBeUndefined()
        expect(newResearchItem.mentions).toEqual(
          expect.arrayContaining([
            {
              username: 'username',
              location: 'update-0-comment:random-id',
            },
          ]),
        )
      })

      it('preserves @mention within Research description', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
          description: '@username',
        })

        // Act
        await store.addComment('fish', researchItem.updates[0])

        // Assert
        expect(setFn).toHaveBeenCalledTimes(1)
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention within an Update description', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].description).toBe(
          '@@{userId:username}',
        )
      })
    })

    describe('deleteComment', () => {
      it('removes a comment', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newResearchItem.updates[0].comments).toHaveLength(0)
      })

      it('admin removes another users comment', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem(
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
            userRoles: ['admin'],
          }),
        )

        // Act
        await store.deleteComment('commentId', researchItem.updates[0])

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newResearchItem.updates[0].comments).toHaveLength(0)
      })

      it('preserves @mention within Research description', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
          description: '@username',
          updates: [
            FactoryResearchItemUpdate({
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention within an Update description', async () => {
        const { store, researchItem, setFn } = await factoryResearchItem({
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].description).toBe(
          '@@{userId:username}',
        )
      })
    })

    describe('editComment', () => {
      it('updates a comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, setFn } = await factoryResearchItem({
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].comments[0].text).toBe(
          'My favourite comment',
        )
      })

      it('admin updates another users comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, setFn } = await factoryResearchItem(
          {
            updates: [
              FactoryResearchItemUpdate({
                comments: [comment],
              }),
            ],
          },
          FactoryUser({
            _id: 'test-user',
            userRoles: ['admin'],
          }),
        )

        // Act
        await store.editComment(
          comment._id,
          'My favourite comment',
          researchItem.updates[0],
        )

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].comments[0].text).toBe(
          'My favourite comment',
        )
      })

      it('preserves @mention within Research description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, setFn } = await factoryResearchItem({
          description: '@username',
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention within an Update description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const { store, researchItem, setFn } = await factoryResearchItem({
          updates: [
            FactoryResearchItemUpdate({
              description: '@username',
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
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.updates[0].description).toBe(
          '@@{userId:username}',
        )
      })

      it('triggers a notification when editing an comment to add @mention', async () => {
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
        expect(newResearchItem.updates[0].comments[0].text).toBe(
          'My favourite comment @@{userId:username}',
        )
        expect(
          store.userNotificationsStore.triggerNotification,
        ).toBeCalledTimes(1)
        expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
          'research_mention',
          'username',
          `/research/${researchItem.slug}#update-0-comment:${newResearchItem.updates[0].comments[0]._id}`,
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
    it('data fetched from server db', async () => {
      const { store, researchItem, getFn } = await factoryResearchItem()
      // necessary as getFn gets called when active research item is set in factory
      jest.clearAllMocks()

      // Act
      await store.incrementViewCount(researchItem._id)

      expect(getFn).toBeCalledTimes(1)
      expect(getFn).toHaveBeenCalledWith('server')
    })
    it('increments views by one', async () => {
      const { store, researchItem, setFn } = await factoryResearchItem()

      const views = researchItem.total_views!
      // Act
      const updatedViews = await store.incrementViewCount(researchItem._id)

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(updatedViews).toBe(views + 1)
    })
  })

  describe('Subscribe', () => {
    it('adds subscriber to the research article', async () => {
      const { store, researchItem, setFn } = await factoryResearchItemFormInput(
        {
          subscribers: ['existing-subscriber'],
        },
      )

      // Act
      await store.addSubscriberToResearchArticle(
        researchItem._id,
        'an-interested-user',
      )

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = setFn.mock.calls[0]
      expect(newResearchItem).toEqual(
        expect.objectContaining({
          subscribers: ['an-interested-user', 'existing-subscriber'],
        }),
      )
    })

    it('does not add a duplicate subscriber to the research article', async () => {
      const { store, researchItem, setFn } = await factoryResearchItemFormInput(
        {
          subscribers: ['a-very-interested-user'],
        },
      )

      // Act
      await store.addSubscriberToResearchArticle(
        researchItem._id,
        'a-very-interested-user',
      )

      expect(setFn).not.toBeCalled()
    })

    it('removes subscriber from the research article', async () => {
      const { store, researchItem, setFn } = await factoryResearchItemFormInput(
        {
          subscribers: ['long-term-subscriber', 'remove-me'],
        },
      )

      // Act
      await store.removeSubscriberFromResearchArticle(
        researchItem._id,
        'remove-me',
      )

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      const [newResearchItem] = setFn.mock.calls[0]
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
