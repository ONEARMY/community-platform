import type { IComment, IQuestion } from '.'

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
