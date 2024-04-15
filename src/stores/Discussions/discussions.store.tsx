import { createContext, useContext } from 'react'
import { cloneDeep } from 'lodash'
import { action, toJS } from 'mobx'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'
import { getCollectionName, updateDiscussionMetadata } from './discussionEvents'

import type { IUserPPDB } from 'src/models'
import type {
  IDiscussion,
  IDiscussionComment,
  IDiscussionSourceModelOptions,
} from 'src/models/discussion.models'
import type { DocReference } from '../databaseV2/DocReference'
import type { IRootStore } from '../RootStore'

const COLLECTION_NAME = 'discussions'

export class DiscussionStore extends ModuleStore {
  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
  }

  @action
  public async fetchOrCreateDiscussionBySource(
    sourceId: string,
    sourceType: IDiscussion['sourceType'],
  ): Promise<IDiscussion | null> {
    const foundDiscussion =
      toJS(
        await this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .getWhere('sourceId', '==', sourceId),
      )[0] || null

    if (foundDiscussion) {
      return foundDiscussion
    }

    // Create a new discussion
    return (await this.uploadDiscussion(sourceId, sourceType)) || null
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
      contributorIds: [],
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
          isUserVerified: !!user.badges?.verified,
          isUserSupporter: !!user.badges?.supporter,
          text: comment,
          parentCommentId: commentId || null,
        }

        currentDiscussion.comments.push(newComment)
        currentDiscussion.contributorIds = this._addContributorId(
          currentDiscussion,
          newComment,
        )

        await this._addNotification(newComment, currentDiscussion)

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

          if (targetComment?._creatorId !== user._id && !hasAdminRights(user)) {
            logger.error('Comment not editable by user', { user })
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

          if (targetComment?._creatorId !== user._id && !hasAdminRights(user)) {
            logger.error('Comment can not be deleted by user', { user })
            throw new Error('Comment not editable by user')
          }

          currentDiscussion.comments = this._findAndDeleteComment(
            user,
            currentDiscussion.comments,
            commentId,
          )
          
          currentDiscussion.contributorIds = this._removeContributorId(
            discussion,
            targetComment?._creatorId,
          )

          return this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  private async _addNotification(
    comment: IDiscussionComment,
    discussion: IDiscussion,
  ) {
    const collectionName = getCollectionName(discussion.sourceType)
    if (!collectionName) {
      return logger.trace(
        `Unable to find collection. Discussion notification not sent. sourceType: ${discussion.sourceType}`,
      )
    }

    const dbRef = this.db
      .collection<IDiscussionSourceModelOptions>(collectionName)
      .doc(discussion.sourceId)
    const parentContent = toJS(await dbRef.get())
    const parentComment = discussion.comments.find(
      ({ _id }) => _id === comment.parentCommentId,
    )

    if (parentContent) {
      const username = !parentComment
        ? parentContent._createdBy
        : parentComment.creatorName

      const _id = !parentComment ? comment._id : parentComment._id

      return this.userNotificationsStore.triggerNotification(
        'new_comment_discussion',
        username,
        `/${collectionName}/${parentContent.slug}#comment:${_id}`,
        parentContent.title,
      )
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

    updateDiscussionMetadata(this.db, discussion)

    return toJS(dbRef.get())
  }

  private _addContributorId({ contributorIds }, comment) {
    const isIdAlreadyPresent = !contributorIds.find(
      (id) => id === comment._creatorId,
    )
    if (!isIdAlreadyPresent) return contributorIds

    return [...contributorIds, comment._creatorId]
  }

  private _removeContributorId({ comments, contributorIds }, _creatorId) {
    const isOtherUserCommentPresent = !comments.find(
      (comment) => comment._creatorId === _creatorId,
    )
    if (isOtherUserCommentPresent) return contributorIds

    return contributorIds.filter((id) => id !== _creatorId)
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

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the DiscussionStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const DiscussionStoreContext = createContext<DiscussionStore>(
  null as any,
)
export const useDiscussionStore = () => useContext(DiscussionStoreContext)
