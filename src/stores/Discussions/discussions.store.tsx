import { makeObservable, toJS } from "mobx";
import { createContext, useContext } from "react";
import { cloneDeep } from 'lodash'
import { logger } from "src/logger";
import { ModuleStore } from "../common/module.store";
import { hasAdminRights, randomID } from "src/utils/helpers";
import { getUserCountry } from "src/utils/getUserCountry";
import { MAX_COMMENT_LENGTH } from "src/constants";
import type { DocReference } from "../databaseV2/DocReference";
import type { IDiscussion } from "src/models/discussion.models";
import type { IComment, IUserPPDB } from "src/models";

const COLLECTION_NAME = 'discussions'

export class DiscussionStore extends ModuleStore {

  constructor() {
    super(null as any, 'discussions')
    makeObservable(this)
    super.init()
  }

  /* public async uploadDiscussion(
    discussion: IDiscussion
  ) {
    const dbRef = this.db
      .collection<IDiscussion>(COLLECTION_NAME)
      .doc(discussion._id)

  } */

  private pushReply(comment: IComment, commentId: string, newComment: IComment) {
    if (comment._id == commentId) {
      comment.replies?.push(newComment)
    } else if (comment.replies && comment.replies.length) {
      comment.replies = comment.replies.map(reply => {
        return this.pushReply(reply, commentId, newComment)
      })
    }
    return comment
  } 

  public async addComment(text: string, discussionId: string, commentId?: string) {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db.collection<IDiscussion>(COLLECTION_NAME).doc(discussionId)

        const currentDiscussion = toJS(await dbRef.get())

        const newComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: getUserCountry(user),
          text: comment
        }

        if (currentDiscussion) {
          if (commentId) {
            const newComments = currentDiscussion.comments.map(comment => {
              return this.pushReply(comment, commentId, newComment)
            })
            currentDiscussion.comments = newComments
          }else {
            currentDiscussion.comments.push(newComment)
          }
          
          await this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  private findAndUpdateComment(user: IUserPPDB, comments: IComment[], newCommentText: string, commentId: string) {
    return comments.map(comment => {
      if ((comment._creatorId === user._id || hasAdminRights(user)) && comment._id == commentId) {
        comment.text = newCommentText
        comment._edited = new Date().toISOString()
      } else if (comment.replies) {
        comment.replies = this.findAndUpdateComment(user, comment.replies, newCommentText, commentId)
      }
      return comment
    })
  }

  public async editComment(text: string, discussionId: string, commentId) {
    try {
      const user = this.activeUser
      const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && comment) {
        const dbRef = this.db.collection<IDiscussion>(COLLECTION_NAME).doc(discussionId)

        const currentDiscussion = toJS(await dbRef.get())
        
        if (currentDiscussion) {
          const editedComments = this.findAndUpdateComment(user, currentDiscussion.comments, text, commentId)
        
          currentDiscussion.comments = editedComments

          this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  private findAndDeleteComment(user: IUserPPDB, comments: IComment[], commentId: string) {
    return comments.filter(comment => {
      if (comment.replies) {
        comment.replies = this.findAndDeleteComment(user, comment.replies, commentId)
      }
      return !((comment._creatorId === user._id || hasAdminRights(user)) &&
      comment._id === commentId)
    })
  }

  public async deleteComment(commentId, discussionId) {
    try {
      const user = this.activeUser

      if (user) {
        const dbRef = this.db.collection<IDiscussion>(COLLECTION_NAME).doc(discussionId)

        const currentDiscussion = toJS(await dbRef.get())
        
        if (currentDiscussion) {
          const filteredComments = this.findAndDeleteComment(user, currentDiscussion.comments, commentId)
        
          currentDiscussion.comments = filteredComments

          this._updateDiscussion(dbRef, currentDiscussion)
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err?.message)
    }
  }

  private async _updateDiscussion(
    dbRef: DocReference<IDiscussion>,
    discussion: IDiscussion
  ) {
    await dbRef.set({...cloneDeep(discussion)})

    return await dbRef.get()
  }
}

export const DiscussionStoreContext = createContext<DiscussionStore>(null as any)
export const useDiscussionStore = () => useContext(DiscussionStoreContext)