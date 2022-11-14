jest.mock('../common/module.store')
import { toJS } from 'mobx'
import { FactoryComment } from 'src/test/factories/Comment'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { ResearchStore } from './research.store'

const factory = async (researchItemOverloads: any = {}) => {
  const researchItem = FactoryResearchItem({
    updates: [FactoryResearchItemUpdate(), FactoryResearchItemUpdate()],
    ...researchItemOverloads,
  })
  const store = new ResearchStore()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(
    FactoryUser({
      _id: 'fake-user',
    }),
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockResolvedValue(researchItem)

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

  await store.setActiveResearchItem('fish')

  return {
    store,
    researchItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
  }
}

describe('research.store', () => {
  describe('Comments', () => {
    describe('addComment', () => {
      it('adds new comment to update', async () => {
        const { store, researchItem, setFn } = await factory()

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
      })

      it('adds @mention to comment text', async () => {
        const { store, researchItem, setFn } = await factory()

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
      })

      it('preserves @mention within Research description', async () => {
        const { store, researchItem, setFn } = await factory({
          description: '@username',
        })

        // Act
        await store.addComment('fish', researchItem.updates[0])

        // Assert
        expect(setFn).toHaveBeenCalledWith(
          expect.objectContaining({
            description: '@@{userId:username}',
          }),
        )
      })

      it('preserves @mention within an Update description', async () => {
        const { store, researchItem, setFn } = await factory({
          updates: [FactoryResearchItemUpdate({ description: '@username' })],
        })

        // Act
        await store.addComment('fish', researchItem.updates[0])

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newResearchItem.updates[0]).toEqual(
          expect.objectContaining({
            description: '@@{userId:username}',
          }),
        )
      })
    })

    describe('deleteComment', () => {
      it('removes a comment', async () => {
        const { store, researchItem, setFn } = await factory({
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

      it('preserves @mention within Research description', async () => {
        const { store, researchItem, setFn } = await factory({
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
        const { store, researchItem, setFn } = await factory({
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
        const { store, researchItem, setFn } = await factory({
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

      it('preserves @mention within Research description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })
        const { store, researchItem, setFn } = await factory({
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
        const { store, researchItem, setFn } = await factory({
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
    })
  })

  describe('updates', () => {
    describe('uploadUpdate', () => {
      it('inserts a new update', async () => {
        const { store, researchItem, setFn } = await factory()
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
        const { store, researchItem, setFn } = await factory()
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

      it('preserves @mention within Research description', async () => {
        const { store, setFn } = await factory({
          description: '@username',
        })

        // Act
        await store.uploadUpdate(FactoryResearchItemUpdate())

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention within an existing Update description', async () => {
        const { store, setFn } = await factory({
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
  })

  describe('item', () => {
    describe('uploadResearch', () => {
      it('adds @mention to Research description', async () => {
        const { store, researchItem, setFn } = await factory()

        // Act
        await store.uploadResearch({
          ...toJS(researchItem),
          description: '@username',
        })

        // Assert
        const [newResearchItem] = setFn.mock.calls[0]
        expect(newResearchItem.description).toBe('@@{userId:username}')
      })

      it('preserves @mention on existing Update description', async () => {
        const { store, researchItem, setFn } = await factory({
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
      })
    })
  })
})
