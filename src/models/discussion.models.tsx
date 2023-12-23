import type { IComment } from './comment.model'

export type IDiscussionComment = IComment & {
  parentCommentId: string | null
}

export type IDiscussion = {
  _id: string
  sourceId: string
  sourceType: 'question'
  comments: IDiscussionComment[]
}
