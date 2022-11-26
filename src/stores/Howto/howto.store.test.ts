jest.mock('../common/module.store')
import type { IHowtoDB } from 'src/models'
import { FactoryComment } from 'src/test/factories/Comment'
import { FactoryHowto } from 'src/test/factories/Howto'
import { FactoryUser } from 'src/test/factories/User'
import type { RootStore } from '..'
import { HowtoStore } from './howto.store'

async function factory(howtoOverloads: Partial<IHowtoDB> = {}) {
  const store = new HowtoStore({} as RootStore)
  const howToItem = FactoryHowto(howtoOverloads)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(
    FactoryUser({
      _id: 'fake-user',
    }),
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockResolvedValue(howToItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.getWhere.mockReturnValue([howToItem])

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

  await store.setActiveHowtoBySlug('howto')

  return {
    store,
    howToItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
  }
}

describe('howto.store', () => {
  describe('uploadHowTo', () => {
    it.todo('updates an existing item')
    it('preserves @mention on existing comments', async () => {
      const comments = [
        FactoryComment({
          _creatorId: 'fake-user',
        }),
        FactoryComment({
          text: '@username',
        }),
      ]
      const { store, howToItem, setFn } = await factory({
        comments,
        description: '@username',
      })

      // Act
      await store.uploadHowTo(howToItem)

      const [newHowto] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newHowto.comments[1].text).toBe('@@{userId:username}')
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
      })

      it('preserves @mentions in description', async () => {
        const { store, setFn } = await factory({
          description: '@username',
        })

        // Act
        await store.addComment('fish')

        // Assert
        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.description).toBe('@@{userId:username}')
      })

      it('preserves @mentions in existing comments', async () => {
        const { store, setFn } = await factory({
          description: '@username',
          comments: [
            FactoryComment({
              text: 'Existing comment @username',
            }),
          ],
        })

        // Act
        await store.addComment('fish')

        // Assert
        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(2)
        expect(newHowto.comments[0].text).toBe(
          'Existing comment @@{userId:username}',
        )
      })
    })

    describe('editComment', () => {
      it('updates comment', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })
        const { store, setFn } = await factory({
          comments: [comment],
        })

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
        const { store, setFn } = await factory({
          comments: [comment],
          description: '@username',
        })

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
        const { store, setFn } = await factory({
          comments,
          description: '@username',
        })

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
        const { store, setFn } = await factory({
          comments: [comment],
        })

        // Act
        await store.deleteComment(comment._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(newHowto.comments).toHaveLength(0)
      })

      it('preserves @mentions in description', async () => {
        const comment = FactoryComment({
          _creatorId: 'fake-user',
        })
        const { store, setFn } = await factory({
          comments: [comment],
          description: '@username',
        })

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
        const { store, setFn } = await factory({
          comments,
          description: '@username',
        })

        // Act
        await store.deleteComment(comments[0]._id)

        const [newHowto] = setFn.mock.calls[0]
        expect(setFn).toHaveBeenCalledTimes(1)
        expect(newHowto.comments).toHaveLength(1)
        expect(newHowto.comments[0].text).toBe('@@{userId:username}')
      })
    })
  })
})
