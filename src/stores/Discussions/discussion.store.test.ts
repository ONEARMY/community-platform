jest.mock('../common/module.store')
import { IDiscussion } from 'src/models'
import { DiscussionStore } from './discussions.store'
import { RootStore } from '..'
import { FactoryUser } from 'src/test/factories/User'
import { FactoryDiscussion } from 'src/test/factories/Discussion'
import { FactoryComment } from 'src/test/factories/Comment'

const factory = async (
  discussions: IDiscussion[] = [FactoryDiscussion({})],
) => {
  const store = new DiscussionStore({} as RootStore)

  const discussionItem = discussions[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockReturnValue(discussionItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(FactoryUser({ _id: 'fake-user' }))

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.aggregationsStore = {
    aggregations: {
      users_verified: ['fake-user'],
    },
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    activeUser: {
      _id: 'fake-user',
    },
  }

  return {
    store,
    discussionItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getFn: store.db.get,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getWhereFn: store.db.getWhere,
  }
}

describe('discussion.store', () => {
  describe('uploadDiscussion', () => {
    it('creates a new discussion with sourceId and sourceType provided', async () => {
      const { store, discussionItem, setFn } = await factory()

      await store.uploadDiscussion(
        discussionItem.sourceId,
        discussionItem.sourceType,
      )

      const [newDiscussion] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.sourceId).toBe(discussionItem.sourceId)
      expect(newDiscussion.sourceType).toBe(discussionItem.sourceType)
    })
  })

  describe('addComment', () => {
    it('adds a new comment', async () => {
      const { store, discussionItem, setFn } = await factory()

      //Act
      await store.addComment(discussionItem, 'New comment')

      // Assert
      const [newDiscussion] = setFn.mock.calls[0]

      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments[0]).toEqual(
        expect.objectContaining({ text: 'New comment' }),
      )
      expect(newDiscussion.comments[1]).toBeUndefined()
    })

    it('adds a reply to a comment', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [FactoryComment({ text: 'New comment' })],
        }),
      ])

      //Act
      await store.addComment(
        discussionItem,
        'New reply',
        discussionItem.comments[0]._id,
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments[0].replies[0]).toEqual(
        expect.objectContaining({ text: 'New reply' }),
      )
      expect(newDiscussion.comments[0].replies[1]).toBeUndefined()
    })
  })

  describe('deleteComment', () => {
    it('removes a comment', async () => {
      const { store, setFn } = await factory()

      //Act
      const comment = FactoryComment({ text: 'New comment' })

      const discussion = FactoryDiscussion({ comments: [comment] })

      await store.uploadDiscussion(discussion.sourceId, discussion.sourceType)

      const [newDiscussion] = setFn.mock.calls[0]

      await store.deleteComment(newDiscussion, comment._id)

      const [newDiscussionWithoutComment] = setFn.mock.calls[1]

      // Asert
      expect(setFn).toHaveBeenCalledTimes(2)
      expect(newDiscussionWithoutComment.comments).toHaveLength(0)
    })
  })

  describe('formatComments', () => {
    it('get formated comments from IComment[] type to UserCommentType[]', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [FactoryComment({ text: 'New comment' })],
        }),
      ])

      // Act
      const formatedComments = store.formatComments(
        {},
        discussionItem.comments,
        0,
      )

      // Assert
      expect(formatedComments.count).toBe(1)
      expect(formatedComments.comments[0].isUserVerified).toBeDefined()
      expect(formatedComments.comments[0].isEditable).toBeDefined()
      expect(formatedComments.comments[0].showReplies).toBeFalsy()
    })
  })
})
