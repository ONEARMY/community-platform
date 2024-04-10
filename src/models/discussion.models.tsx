import type { IComment } from './comment.model'
import type { IQuestion } from './question.models'

/**
 * Extends IComment with parentCommentId
 * to support nested comments
 */
export type IDiscussionComment = IComment & {
  parentCommentId: string | null
  isUserSupporter?: boolean
}

export type IDiscussion = {
  _id: string
  sourceId: string
  sourceType: 'question' | 'researchUpdate'
  comments: IDiscussionComment[]
}

export type IDiscussionSourceModelOptions = IQuestion.Item
