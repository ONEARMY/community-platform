import { describe, expect, it, vi } from 'vitest'

vi.mock('../common/module.store')
import { faker } from '@faker-js/faker'
import {
  FactoryDiscussion,
  FactoryDiscussionComment,
} from 'src/test/factories/Discussion'
import { FactoryUser } from 'src/test/factories/User'

import { DiscussionStore } from './discussions.store'

import type { IDiscussion, IUserPPDB } from 'src/models'
import type { IRootStore } from '../RootStore'

const factory = async (
  discussions: IDiscussion[] = [FactoryDiscussion({})],
  activeUser: IUserPPDB = FactoryUser(),
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
    it('fetches a discussion by sourceId', async () => {
      const fakeSourceId = faker.internet.password()
      const fakePrimaryContentId = faker.internet.password()
      const { store, getWhereFn } = await factory([
        FactoryDiscussion({ sourceId: fakeSourceId }),
      ])

      await store.fetchOrCreateDiscussionBySource(
        fakeSourceId,
        'question',
        fakePrimaryContentId,
      )

      expect(getWhereFn).toHaveBeenCalledTimes(1)
      expect(getWhereFn).toHaveBeenCalledWith('sourceId', '==', fakeSourceId)
    })

    it('creates a discussion if one does not exist', async () => {
      const { store, getWhereFn, setFn } = await factory()

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
      const { store, discussionItem, setFn } = await factory()

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
      const { store, discussionItem, setFn, getFn } = await factory()

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
    })

    it('adds a reply to a comment', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [FactoryDiscussionComment({ text: 'New comment' })],
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
      expect(newDiscussion.contributorIds).toEqual(
        expect.arrayContaining([newDiscussion.comments[1]._creatorId]),
      )
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'New reply' }),
        ]),
      )
    })

    it('handles error fetching discussion', async () => {
      const { store, discussionItem, setFn, getFn } = await factory()

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
      const { store, discussionItem, setFn } = await factory(
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
      const { store, discussionItem, setFn } = await factory(
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

    it('throws an error for a different user', async () => {
      const { store, discussionItem, setFn } = await factory([
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
      ).rejects.toThrowError()

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
      const { store, setFn, discussionItem } = await factory(
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
      const { store, setFn, discussionItem } = await factory(
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

    it('throws an error for a different user', async () => {
      const { store, discussionItem, setFn } = await factory([
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
      ).rejects.toThrowError()

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })
})
