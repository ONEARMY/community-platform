/* eslint-disable no-case-declarations */
import { createContext, useContext } from 'react'
import lodash from 'lodash'
import { toJS } from 'mobx'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { getDiscussionContributorsToNotify } from 'src/utils/getDiscussionContributorsToNotify'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'

import { changeUserReferenceToPlainText } from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import { getCollectionName, updateDiscussionMetadata } from './discussionEvents'

import type {
  IComment,
  IDiscussion,
  IDiscussionDB,
  IDiscussionSourceModelOptions,
  IUserDB,
} from 'oa-shared'
import type { DocReference } from '../databaseV2/DocReference'
import type { IRootStore } from '../RootStore'

const DISCUSSIONS_COLLECTION = 'discussions'

export class DiscussionStore extends ModuleStore {
  constructor(rootStore: IRootStore) {
    super(rootStore, DISCUSSIONS_COLLECTION)
  }

  public async fetchOrCreateDiscussionBySource(
    sourceId: string,
    sourceType: IDiscussion['sourceType'],
    primaryContentId: IDiscussion['primaryContentId'],
  ): Promise<IDiscussionDB | null> {
    const discussions = toJS(
      await this.db
        .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
        .getWhere('sourceId', '==', sourceId),
    )

    const foundDiscussion = discussions
      ? discussions.find((x) => x.comments.length > 0) || discussions.at(0)
      : null

    if (foundDiscussion) {
      return this._formatDiscussion(foundDiscussion)
    }

    const newDiscussion = await this.uploadDiscussion(
      sourceId,
      sourceType,
      primaryContentId,
    )

    if (newDiscussion) {
      return this._formatDiscussion(newDiscussion)
    }

    return null
  }

  public async uploadDiscussion(
    sourceId: string,
    sourceType: IDiscussion['sourceType'],
    primaryContentId: IDiscussion['primaryContentId'],
  ): Promise<IDiscussionDB | null> {
    const newDiscussion: IDiscussion = {
      _id: randomID(),
      sourceId,
      sourceType,
      primaryContentId: primaryContentId || sourceId,
      comments: [],
      contributorIds: [],
    }

    const dbRef = this.db
      .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
      .doc(newDiscussion._id)

    return await this._updateDiscussion(dbRef, newDiscussion)
  }

  public async addComment(
    discussion: IDiscussion,
    text: string,
    commentId?: string,
  ): Promise<IDiscussionDB | null> {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db
          .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get('server'))

        if (!currentDiscussion) {
          throw new Error('Discussion not found')
        }

        const creatorImage = this._getUserAvatar(user)
        const newComment: IComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: getUserCountry(user),
          isUserVerified: !!user.badges?.verified,
          isUserSupporter: !!user.badges?.supporter,
          text: comment,
          parentCommentId: commentId || null,
          ...(creatorImage ? { creatorImage } : {}),
        }

        currentDiscussion.comments.push(newComment)
        currentDiscussion.contributorIds = this._addContributorId(
          currentDiscussion.contributorIds || [],
          newComment,
        )

        // Do not await so it doesn't block adding a comment
        this._addNotifications(newComment, currentDiscussion)

        return this._updateDiscussion(dbRef, currentDiscussion)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }

    return null
  }

  public async editComment(
    discussion: IDiscussion,
    commentId: string,
    text: string,
  ): Promise<IDiscussionDB | null> {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db
          .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get('server'))

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

    return null
  }

  public async deleteComment(
    discussion: IDiscussion,
    commentId: string,
  ): Promise<IDiscussionDB | null> {
    try {
      const user = this.activeUser

      if (user) {
        const dbRef = this.db
          .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get('server'))

        if (currentDiscussion) {
          const targetComment = currentDiscussion.comments.find(
            (comment) => comment._id === commentId,
          )

          if (!targetComment) {
            throw new Error('Cannot find comment')
          }

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
            discussion.comments,
            discussion.contributorIds || [],
            targetComment._creatorId,
          )

          return this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }

    return null
  }

  private async _addNotifications(comment: IComment, discussion: IDiscussion) {
    const collectionName = getCollectionName(discussion.sourceType)
    if (!collectionName) {
      return logger.trace(
        `Unable to find collection. Discussion notification not sent. sourceType: ${discussion.sourceType}`,
      )
    }

    const parentComment = discussion.comments.find(
      ({ _id }) => _id === comment.parentCommentId,
    )
    const commentId = parentComment ? parentComment._id : comment._id

    const dbRef = this.db
      .collection<IDiscussionSourceModelOptions>(collectionName)
      .doc(discussion.sourceId)
    const parentContent = toJS(await dbRef.get('server'))

    if (parentContent) {
      const recipientsToNotify = getDiscussionContributorsToNotify(
        discussion,
        parentContent,
        comment,
      )

      return await Promise.all(
        recipientsToNotify.map((recipient) => {
          this.userNotificationsStore.triggerNotification(
            'new_comment_discussion',
            recipient,
            `/${collectionName}/${parentContent.slug}#comment:${commentId}`,
            parentContent.title,
          )
        }),
      )
    }
  }

  private _findAndUpdateComment(
    user: IUserDB,
    comments: IComment[],
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

  private _formatCommentList(comments: IComment[] = []): IComment[] {
    return comments.map((comment: IComment) => {
      return {
        ...comment,
        text: changeUserReferenceToPlainText(comment.text),
      }
    })
  }

  private _formatDiscussion(discussion: IDiscussionDB): IDiscussionDB {
    return {
      ...discussion,
      comments: this._formatCommentList(discussion.comments),
    }
  }

  private async _updateDiscussion(
    dbRef: DocReference<IDiscussion>,
    discussion: IDiscussion,
  ): Promise<IDiscussionDB | null> {
    await dbRef.set({ ...lodash.cloneDeep(discussion) })

    // Do not await so it doesn't block adding a comment
    updateDiscussionMetadata(this.db, discussion)

    const updatedDiscussion = toJS(await dbRef.get('server'))

    return updatedDiscussion ? updatedDiscussion : null
  }

  private async _validatePrimaryContentId(
    discussion: IDiscussion,
    primaryContentId: string | undefined,
  ): Promise<IDiscussion | null> {
    if (
      !primaryContentId ||
      discussion.primaryContentId === primaryContentId ||
      discussion.sourceType !== 'researchUpdate'
    )
      return discussion

    const dbRef = this.db
      .collection<IDiscussion>(DISCUSSIONS_COLLECTION)
      .doc(discussion._id)

    return await this._updateDiscussion(dbRef, {
      ...discussion,
      primaryContentId,
    })
  }

  private _addContributorId(contributorIds: string[], comment: IComment) {
    if (contributorIds.length === 0) {
      return [comment._creatorId]
    }

    const isIdAlreadyPresent = !contributorIds.find(
      (id) => id === comment._creatorId,
    )
    if (!isIdAlreadyPresent) {
      return contributorIds
    }

    return [...contributorIds, comment._creatorId]
  }

  private _removeContributorId(
    comments: IComment[],
    contributorIds: string[],
    _creatorId: string,
  ) {
    const isOtherUserCommentPresent = !comments.find(
      (comment) => comment._creatorId === _creatorId,
    )

    if (isOtherUserCommentPresent) {
      return contributorIds
    }

    return contributorIds.filter((id) => id !== _creatorId)
  }

  private _findAndDeleteComment(
    user: IUserDB,
    comments: IComment[],
    commentId: string,
  ) {
    return comments.map((comment) => {
      if (
        (comment._creatorId === user._id || hasAdminRights(user)) &&
        comment._id == commentId
      ) {
        comment._deleted = true
      }
      return comment
    })
  }

  private _getUserAvatar(user: IUserDB) {
    if (user.userImage && user.userImage.downloadUrl) {
      return cdnImageUrl(user.userImage.downloadUrl, { width: 100 })
    }
    return null
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
