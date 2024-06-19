/* eslint-disable no-case-declarations */
import { createContext, useContext } from 'react'
import { toJS } from 'mobx'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'

import { changeUserReferenceToPlainText } from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import { getCollectionName, updateDiscussionMetadata } from './discussionEvents'

import type { IResearch, IUserPPDB } from 'src/models'
import type {
  IComment,
  IDiscussion,
  IDiscussionDB,
  IDiscussionSourceModelOptions,
} from 'src/models/discussion.models'
import type { DocReference } from '../databaseV2/DocReference'
import type { IRootStore } from '../RootStore'
import type { CommentsTotalEvent } from './discussionEvents'

const COLLECTION_NAME = 'discussions'

export class DiscussionStore extends ModuleStore {
  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
  }

  public async fetchOrCreateDiscussionBySource(
    sourceId: string,
    sourceType: IDiscussion['sourceType'],
    primaryContentId: IDiscussion['primaryContentId'],
  ): Promise<IDiscussionDB | null> {
    const foundDiscussion =
      toJS(
        await this.db
          .collection<IDiscussion>(COLLECTION_NAME)
          .getWhere('sourceId', '==', sourceId),
      )[0] || null

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

    const dbRef = await this.db
      .collection<IDiscussion>(COLLECTION_NAME)
      .doc(newDiscussion._id)

    return this._updateDiscussion(dbRef, newDiscussion, 'neutral')
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
          .collection<IDiscussion>(COLLECTION_NAME)
          .doc(discussion._id)

        const currentDiscussion = toJS(await dbRef.get())

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
          currentDiscussion,
          newComment,
        )

        await this._addNotifications(newComment, currentDiscussion)

        return this._updateDiscussion(dbRef, currentDiscussion, 'add')
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

          return this._updateDiscussion(dbRef, currentDiscussion, 'neutral')
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

          return this._updateDiscussion(dbRef, currentDiscussion, 'delete')
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

    switch (collectionName) {
      case 'research':
        const researchRef = this.db
          .collection<IResearch.Item>(collectionName)
          .doc(discussion.primaryContentId)

        const research = toJS(await researchRef.get())

        if (research) {
          const updateIndex = research.updates.findIndex(
            ({ _id }) => _id == discussion.sourceId,
          )
          const update = research.updates[updateIndex]

          const username = parentComment
            ? parentComment.creatorName
            : research._createdBy

          await this.userNotificationsStore.triggerNotification(
            'new_comment_discussion',
            username,
            '/research/' + research.slug + '#update_' + updateIndex,
            research.title,
          )

          if (update && update.collaborators) {
            await update.collaborators.map((collaborator) => {
              this.userNotificationsStore.triggerNotification(
                'new_comment_discussion',
                collaborator,
                `/research/${research.slug}#update_${updateIndex}-comment:${commentId}`,
                research.title,
              )
            })
          }
        }
        return
      default:
        const dbRef = this.db
          .collection<IDiscussionSourceModelOptions>(collectionName)
          .doc(discussion.sourceId)
        const parentContent = toJS(await dbRef.get())
        const parentPath =
          collectionName === 'howtos' ? 'how-to' : collectionName

        if (parentContent) {
          const username = parentComment
            ? parentComment.creatorName
            : parentContent._createdBy

          return this.userNotificationsStore.triggerNotification(
            'new_comment_discussion',
            username,
            `/${parentPath}/${parentContent.slug}#comment:${commentId}`,
            parentContent.title,
          )
        }
    }
  }

  private _findAndUpdateComment(
    user: IUserPPDB,
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
    commentsTotalEvent: CommentsTotalEvent,
  ): Promise<IDiscussionDB | null> {
    await dbRef.set({ ...structuredClone(discussion) })
    await updateDiscussionMetadata(this.db, discussion, commentsTotalEvent)
    const updatedDiscussion = toJS(await dbRef.get())

    return updatedDiscussion ? updatedDiscussion : null
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

  private _getUserAvatar(user: IUserPPDB) {
    if (
      user.coverImages &&
      user.coverImages[0] &&
      user.coverImages[0].downloadUrl
    ) {
      return user.coverImages[0].downloadUrl
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
