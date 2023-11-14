import type { IComment } from './comment.model'

export type IDiscussion = {
  _id: string
  sourceId: string
  sourceType: string
  comments: IComment[]
}
