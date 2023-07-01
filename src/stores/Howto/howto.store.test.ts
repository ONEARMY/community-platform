jest.mock('../common/module.store')
import type { IHowtoDB, IUser } from 'src/models'
import { FactoryComment } from 'src/test/factories/Comment'
import { FactoryHowto, FactoryHowtoStep } from 'src/test/factories/Howto'
import { FactoryUser } from 'src/test/factories/User'
import type { RootStore } from '..'
import { HowtoStore } from './howto.store'

const factory = async (
  howTos: IHowtoDB[] = [FactoryHowto({})],
  userOverloads?: Partial<IUser>,
) => {
  const store = new HowtoStore({} as RootStore)

  const howToItem = howTos[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(
    FactoryUser({
      _id: 'fake-user',
      ...userOverloads,
    }),
  )

  store.updateActiveSorter('created')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockResolvedValue(howToItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockReturnValue([howToItem])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    getUserProfile: jest.fn().mockImplementation((userName) =>
      FactoryUser({
        _authID: 'userId',
        userName,
      }),
    ),
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userNotificationsStore = {
    triggerNotification: jest.fn(),
  }

  await store.setActiveHowtoBySlug('howto')

  return {
    store,
    howToItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getFn: store.db.get,
  }
}

describe('howto.store', () => {
  describe('uploadHowTo', () => {
    it.todo('updates an existing item')

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

    it('creates notifications for any new mentions in description', async () => {
      const howtos = [
        FactoryHowto({
          description: '@username',
          mentions: [
            {
              username: 'username',
              location: 'description',
            },
          ],
          comments: [
            FactoryComment({
              text: '@commentauthor',
            }),
          ],
        }),
      ]
      const { store, howToItem, setFn } = await factory(howtos)

      await store.uploadHowTo({
        ...howToItem,
      })

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(store.userNotificationsStore.triggerNotification).toBeCalledTimes(
        1,
      )
      expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
        'howto_mention',
        'commentauthor',
        `/how-to/${howToItem.slug}#comment:${howToItem.comments![0]._id}`,
      )
    })

    it('creates notifications for any new mentions in a how-to step', async () => {
      const howtos = [
        FactoryHowto({
          description: '@username',
          mentions: [
            {
              username: 'username',
              location: 'description',
            },
          ],
          steps: [
            {
              images: [
                {
                  downloadUrl: 'string',
                  fullPath: 'string',
                  name: 'string',
                  type: 'string',
                  size: 2300,
                  timeCreated: 'string',
                  updated: 'string',
                },
              ],
              title: 'How to step',
              text: 'Step description featuring a howto',
            },
          ],
          comments: [
            FactoryComment({
              text: '@commentauthor',
            }),
          ],
        }),
      ]
      const { store, howToItem, setFn } = await factory(howtos)

      await store.uploadHowTo({
        ...howToItem,
      })

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(store.userNotificationsStore.triggerNotification).toBeCalledTimes(
        1,
      )
      expect(store.userNotificationsStore.triggerNotification).toBeCalledWith(
        'howto_mention',
        'commentauthor',
        `/how-to/${howToItem.slug}#comment:${howToItem.comments![0]._id}`,
      )
    })

    it('preserves @mention on existing comments', async () => {
      const comments = [
        FactoryComment({
          _creatorId: 'fake-user',
        }),
        FactoryComment({
          text: '@username',
        }),
      ]

      const howtos = [
        FactoryHowto({
          comments,
          description: '@username',
        }),
      ]
      const { store, howToItem, setFn } = await factory(howtos)

      // Act
      await store.uploadHowTo(howToItem)

      const [newHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newHowto.comments[1].text).toBe('@@{userId:username}')
      expect(newHowto.mentions).toEqual(
        expect.arrayContaining([
          {
            username: 'username',
            location: `comment:${newHowto.comments[1]._id}`,
          },
        ]),
      )
    })
  })

  describe('Comments', () => {
    describe('addComment', () => {
      it('adds comment to howto', async () => {
        const { store, setFn } = await factory()

        // Act
        await store.addComment('short comment including @username')

        // Assert
        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(1)
        expect(newHowto.comments[0]).toEqual(
          expect.objectContaining({
            text: 'short comment including @@{userId:username}',
          }),
        )
        expect(newHowto.mentions).toEqual(
          expect.arrayContaining([
            {
              username: 'username',
              location: 'comment:' + newHowto.comments[0]._id,
            },
          ]),
        )
      })

      it('preserves @mentions in description', async () => {
        const howtos = [
          FactoryHowto({
            description: '@username',
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.addComment('fish')

        // Assert
        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.description).toBe('@@{userId:username}')
        expect(newHowto.mentions).toEqual(
          expect.arrayContaining([
            {
              username: 'username',
              location: 'description',
            },
          ]),
        )
      })

      it('preserves @mentions in existing comments', async () => {
        const howtos = [
          FactoryHowto({
            description: '@username',
            comments: [
              FactoryComment({
                text: 'Existing comment @username',
              }),
            ],
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.addComment('fish')

        // Assert
        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(2)
        expect(newHowto.comments[0].text).toBe(
          'Existing comment @@{userId:username}',
        )
        expect(newHowto.mentions).toEqual(
          expect.arrayContaining([
            {
              username: 'username',
              location: 'comment:' + newHowto.comments[0]._id,
            },
          ]),
        )
      })
    })

    describe('editComment', () => {
      it('updates comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const howtos = [
          FactoryHowto({
            comments: [comment],
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.editComment(comment._id, 'New text')

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.comments[0]).toEqual(
          expect.objectContaining({
            text: 'New text',
          }),
        )
      })

      it('admin updates another users comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'test-user',
        })

        const howtos = [
          FactoryHowto({
            comments: [comment],
          }),
        ]
        const { store, setFn } = await factory(howtos, { userRoles: ['admin'] })

        // Act
        await store.editComment(comment._id, 'New text')

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.comments[0]).toEqual(
          expect.objectContaining({
            text: 'New text',
          }),
        )
      })
      it('preserves @mentions in description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const howtos = [
          FactoryHowto({
            comments: [comment],
            description: '@username',
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.editComment(comment._id, 'New text')

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.description).toBe('@@{userId:username}')
      })
      it('preserves @mentions in existing comments', async () => {
        const comments = [
          FactoryComment({
            _creatorId: 'fake-user',
          }),
          FactoryComment({
            text: '@username',
          }),
        ]

        const howtos = [
          FactoryHowto({
            comments,
            description: '@username',
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.editComment(comments[0]._id, 'An updated message')

        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(comments.length)
        expect(newHowto.comments[1].text).toBe('@@{userId:username}')
      })
    })

    describe('deleteComment', () => {
      it('removes comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const howtos = [
          FactoryHowto({
            comments: [comment],
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.deleteComment(comment._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.comments).toHaveLength(0)
      })

      it('admin deletes another users comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'test-user',
        })
        const howtos = [
          FactoryHowto({
            comments: [comment],
          }),
        ]
        const { store, setFn } = await factory(howtos, { userRoles: ['admin'] })

        // Act
        await store.deleteComment(comment._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.comments).toHaveLength(0)
      })

      it('preserves @mentions in description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })

        const howtos = [
          FactoryHowto({
            comments: [comment],
            description: '@username',
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.deleteComment(comment._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.description).toBe('@@{userId:username}')
      })

      it('preserves @mentions in existing comments', async () => {
        const comments = [
          FactoryComment({
            _creatorId: 'fake-user',
          }),
          FactoryComment({
            text: '@username',
          }),
        ]

        const howtos = [
          FactoryHowto({
            comments,
            description: '@username',
          }),
        ]
        const { store, setFn } = await factory(howtos)

        // Act
        await store.deleteComment(comments[0]._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(1)
        expect(newHowto.comments[0].text).toBe('@@{userId:username}')
      })
    })
  })

  describe('unsetActiveHowTo', () => {
    it('removes state from activeHowto property', async () => {
      const { store } = await factory()

      await store.removeActiveHowto()

      expect(store.activeHowto).toBe(null)
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

  describe('incrementViews', () => {
    it('data fetched from server db', async () => {
      const { store, howToItem, getFn } = await factory()

      // Act
      await store.incrementViewCount(howToItem._id)

      expect(getFn).toBeCalledTimes(1)
      expect(getFn).toHaveBeenCalledWith('server')
    })
    it('increments views by one', async () => {
      const { store, howToItem, setFn } = await factory()

      const views = howToItem.total_views!
      // Act
      const updatedViews = await store.incrementViewCount(howToItem._id)

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(updatedViews).toBe(views + 1)
    })
  })
})
