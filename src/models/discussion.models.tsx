import type { IComment } from './comment.model'
import type { IQuestion } from './question.models'

/**
 * Extends IComment with parentCommentId
 * to support nested comments
 */
export type IDiscussionComment = IComment & {
  parentCommentId: string | null
  isUserSupporter?: boolean
  isEditable?: boolean
}

export type IDiscussion = {
  _id: string
  comments: IDiscussionComment[]
  contributorIds: string[]
  primaryContentId?: string
  sourceId: string
  sourceType: 'question' | 'researchUpdate'
}

export type IDiscussionSourceModelOptions = IQuestion.Item
