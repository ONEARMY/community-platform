import { createContext, useContext } from 'react'
import { cloneDeep } from 'lodash'
import { action, makeObservable, toJS } from 'mobx'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'

import type { IUserPPDB } from 'src/models'
import type {
  IDiscussion,
  IDiscussionComment,
} from 'src/models/discussion.models'
import type { RootStore } from '..'
import type { DocReference } from '../databaseV2/DocReference'

const COLLECTION_NAME = 'discussions'

export class DiscussionStore extends ModuleStore {
  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
  }

  public async fetchDiscussionBySourceId(
    sourceId: string,
  ): Promise<IDiscussion | null> {
    return (
      toJS(
        await this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .getWhere('sourceId', '==', sourceId),
      )[0] || null
    )
  }

  public async uploadDiscussion(
    sourceId: string,
    sourceType: IDiscussion['sourceType'],
  ): Promise<IDiscussion | undefined> {
    const newDiscussion: IDiscussion = {
      _id: randomID(),
      sourceId,
      sourceType,
      comments: [],
    }

    const dbRef = await this.db
      .collection<IDiscussion>(COLLECTION_NAME)
      .doc(newDiscussion._id)

    return this._updateDiscussion(dbRef, newDiscussion)
  }

  @action
  public async addComment(
    discussion: IDiscussion,
    text: string,
    commentId?: string,
  ): Promise<IDiscussion | undefined> {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get())

        if (!currentDiscussion) {
          throw new Error('Discussion not found')
        }

        const newComment: IDiscussionComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: getUserCountry(user),
          text: comment,
          parentCommentId: commentId || null,
        }

        currentDiscussion.comments.push(newComment)

        return this._updateDiscussion(dbRef, currentDiscussion)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  @action
  public async editComment(
    discussion: IDiscussion,
    commentId: string,
    text: string,
  ): Promise<IDiscussion | undefined> {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get())

        if (currentDiscussion) {
          const targetComment = currentDiscussion.comments.find(
            (comment) => comment._id === commentId,
          )

          if (targetComment?._creatorId !== user._id) {
            throw new Error('Comment not editable by user')
          }

          currentDiscussion.comments = this._findAndUpdateComment(
            user,
            currentDiscussion.comments,
            text,
            commentId,
          )

          return this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  @action
  public async deleteComment(
    discussion: IDiscussion,
    commentId: string,
  ): Promise<IDiscussion | undefined> {
    try {
      const user = this.activeUser

      if (user) {
        const dbRef = this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get())

        if (currentDiscussion) {
          const targetComment = currentDiscussion.comments.find(
            (comment) => comment._id === commentId,
          )

          if (targetComment?._creatorId !== user._id) {
            throw new Error('Comment not editable by user')
          }

          currentDiscussion.comments = this._findAndDeleteComment(
            user,
            currentDiscussion.comments,
            commentId,
          )

          return this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  private _findAndUpdateComment(
    user: IUserPPDB,
    comments: IDiscussionComment[],
    newCommentText: string,
    commentId: string,
  ) {
    return comments.map((comment) => {
      if (
        (comment._creatorId === user._id || hasAdminRights(user)) &&
        comment._id == commentId
      ) {
        comment.text = newCommentText
        comment._edited = new Date().toISOString()
      }
      return comment
    })
  }

  private async _updateDiscussion(
    dbRef: DocReference<IDiscussion>,
    discussion: IDiscussion,
  ) {
    await dbRef.set({ ...cloneDeep(discussion) })

    return toJS(dbRef.get())
  }

  private _findAndDeleteComment(
    user: IUserPPDB,
    comments: IDiscussionComment[],
    commentId: string,
  ) {
    return comments.filter((comment) => {
      return !(
        (comment._creatorId === user._id || hasAdminRights(user)) &&
        comment._id === commentId
      )
    })
  }
}

export const DiscussionStoreContext = createContext<DiscussionStore>(
  null as any,
)
export const useDiscussionStore = () => useContext(DiscussionStoreContext)
