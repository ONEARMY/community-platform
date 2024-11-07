import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')
import {
  FactoryDiscussion,
  FactoryDiscussionComment,
} from 'src/test/factories/Discussion'
import { FactoryUser } from 'src/test/factories/User'

import { DiscussionStore } from './discussions.store'

import type { IDiscussion, IUserDB } from 'oa-shared'
import type { IRootStore } from '../RootStore'

const factory = (
  discussions: IDiscussion[] = [FactoryDiscussion({})],
  activeUser: IUserDB = FactoryUser(),
) => {
  const store = new DiscussionStore({} as IRootStore)

  const discussionItem = discussions[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockReturnValue(discussionItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(activeUser)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.aggregationsStore = {
    aggregations: {
      isVerified: vi.fn((userId) => userId === 'fake-user'),
      users_verified: ['fake-user'],
    },
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    activeUser: activeUser,
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userNotificationsStore = {
    triggerNotification: vi.fn(),
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
  describe('fetchOrCreateDiscussionBySource', () => {
    it('creates a discussion if one does not exist', async () => {
      const { store, getWhereFn, setFn } = factory()

      getWhereFn.mockReturnValueOnce([])

      await store.fetchOrCreateDiscussionBySource(
        'fake-source-id',
        'researchUpdate',
        'fake-primary-id',
      )

      expect(getWhereFn).toHaveBeenCalledTimes(1)

      expect(setFn).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceId: 'fake-source-id',
          sourceType: 'researchUpdate',
          primaryContentId: 'fake-primary-id',
        }),
      )
    })
  })

  describe('uploadDiscussion', () => {
    it('creates a new discussion with sourceId and sourceType provided', async () => {
      const { store, discussionItem, setFn } = factory()

      await store.uploadDiscussion(
        discussionItem.sourceId,
        discussionItem.sourceType,
        discussionItem.primaryContentId,
      )

      const [newDiscussion] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.sourceId).toBe(discussionItem.sourceId)
      expect(newDiscussion.sourceType).toBe(discussionItem.sourceType)
    })
  })

  describe('addComment', () => {
    it('adds a new comment for questions', async () => {
      const { store, discussionItem, setFn, getFn } = factory()

      //Act
      await store.addComment(discussionItem, 'New comment')

      // Assert
      const [newDiscussion] = setFn.mock.calls[0]

      expect(getFn).toHaveBeenCalled()
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments[0]).toEqual(
        expect.objectContaining({ text: 'New comment' }),
      )
      expect(newDiscussion.comments[1]).toBeUndefined()
      expect(
        store.userNotificationsStore.triggerNotification,
      ).toHaveBeenCalledWith(
        'new_comment_discussion',
        undefined, // concern of another store
        `/questions/undefined#comment:${discussionItem.comments[0]._id}`,
        undefined, // concern of another store
      )
    })

    it('notifies all contributors of a new comment (except the commenter)', async () => {
      const discussions = [
        FactoryDiscussion({ contributorIds: ['1', '2', '3'] }),
      ]
      const { store, discussionItem } = factory(discussions)

      //Act
      await store.addComment(discussionItem, 'New comment')

      expect(
        store.userNotificationsStore.triggerNotification,
      ).toHaveBeenCalledTimes(4)
    })

    it('adds a reply to a comment', async () => {
      const discussions = [
        FactoryDiscussion({}, [
          FactoryDiscussionComment({ text: 'New comment' }),
        ]),
      ]
      const { store, discussionItem, setFn } = factory(discussions)

      //Act
      await store.addComment(
        discussionItem,
        'New reply',
        discussionItem.comments[0]._id,
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.contributorIds).toEqual(
        expect.arrayContaining([newDiscussion.comments[1]._creatorId]),
      )
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'New reply' }),
        ]),
      )
      expect(
        store.userNotificationsStore.triggerNotification,
      ).toHaveBeenCalledWith(
        'new_comment_discussion',
        discussionItem.comments[0]._creatorId,
        `/questions/undefined#comment:${discussionItem.comments[0]._id}`,
        undefined, // concern of another store
      )
    })

    it('handles error fetching discussion', () => {
      const { store, discussionItem, setFn, getFn } = factory()

      getFn.mockReturnValue(null)
      //Act
      expect(() =>
        store.addComment(discussionItem, 'New comment'),
      ).rejects.toThrowError('Discussion not found')

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })

  describe('editComent', () => {
    it('allows author to make changes comment', async () => {
      const { store, discussionItem, setFn } = factory(
        [
          FactoryDiscussion({
            comments: [
              FactoryDiscussionComment({
                _id: 'fake-comment-id',
                _creatorId: 'fake-user',
                text: 'New comment',
              }),
            ],
          }),
        ],
        FactoryUser({
          _id: 'fake-user',
        }),
      )

      //Act
      await store.editComment(
        discussionItem,
        'fake-comment-id',
        'Edited comment',
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Edited comment' }),
        ]),
      )
    })

    it('allows admin to make changes comment', async () => {
      const { store, discussionItem, setFn } = factory(
        [
          FactoryDiscussion({
            comments: [
              FactoryDiscussionComment({
                _id: 'fake-comment-id',
                _creatorId: 'fake-user',
                text: 'New comment',
              }),
            ],
          }),
        ],
        FactoryUser({
          _id: 'admin-user',
          userRoles: ['admin'] as any,
        }),
      )

      //Act
      await store.editComment(
        discussionItem,
        'fake-comment-id',
        'Edited comment',
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Edited comment' }),
        ]),
      )
    })

    it('throws an error for a different user', () => {
      const { store, discussionItem, setFn } = factory([
        FactoryDiscussion({
          comments: [
            FactoryDiscussionComment({
              _id: 'fake-comment-id',
              _creatorId: 'another-user-id',
              text: 'New comment',
            }),
          ],
        }),
      ])

      //Act
      expect(() =>
        store.editComment(discussionItem, 'fake-comment-id', 'Edited comment'),
      ).rejects.toThrowError('Comment not editable by user')

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })

  describe('deleteComment', () => {
    it('allows author to remove a comment', async () => {
      const comment = FactoryDiscussionComment({
        _creatorId: 'fake-user',
        text: 'New comment',
      })
      const { store, setFn, discussionItem } = factory(
        [FactoryDiscussion({ comments: [comment] })],
        FactoryUser({ _id: 'fake-user' }),
      )

      //Act
      await store.deleteComment(discussionItem, comment._id)

      // Asert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(discussionItem.contributorIds).not.toEqual(
        expect.arrayContaining([comment._creatorId]),
      )
      expect(setFn.mock.calls[0][0].comments[0]._deleted).toEqual(true)
    })

    it('allows admin to remove a comment', async () => {
      const comment = FactoryDiscussionComment({
        _creatorId: 'not-admin-user',
        text: 'New comment',
      })
      const { store, setFn, discussionItem } = factory(
        [FactoryDiscussion({ comments: [comment] })],
        FactoryUser({
          _id: 'admin-user',
          userRoles: ['admin'] as any,
        }),
      )

      //Act
      await store.deleteComment(discussionItem, comment._id)

      // Asert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(setFn.mock.calls[0][0].comments[0]._deleted).toEqual(true)
    })

    it('throws an error for a different user', () => {
      const { store, discussionItem, setFn } = factory([
        FactoryDiscussion({
          comments: [
            FactoryDiscussionComment({
              _id: 'fake-comment-id',
              _creatorId: 'another-user-id',
              text: 'New comment',
            }),
          ],
        }),
      ])

      //Act
      expect(() =>
        store.deleteComment(discussionItem, 'fake-comment-id'),
      ).rejects.toThrowError('Comment not editable by user')

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })
})
