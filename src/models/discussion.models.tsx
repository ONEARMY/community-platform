import type { IComment } from './comment.model'

/**
 * Extends IComment with parentCommentId
 * to support nested comments
 */
export type IDiscussionComment = IComment & {
  parentCommentId: string | null
}

export type IDiscussion = {
  _id: string
  sourceId: string
  sourceType: 'question'
  comments: IDiscussionComment[]
}
