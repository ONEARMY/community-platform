import type { IComment, IQuestion } from 'src/models'

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

export type IDiscussionSourceModelOptions = IQuestion.Item
