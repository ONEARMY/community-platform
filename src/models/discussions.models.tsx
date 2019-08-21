import { IDbDoc, ISODateString } from './common.models'

export interface IPostFormInput {
  title: string
  content: string
  tags: string[]
}

export interface IDiscussionPost extends IPostFormInput, IDbDoc {
  _lastResponse?: ISODateString
  _commentCount: number
  _viewCount: number
  _usefulCount: number
  _last3Comments: any
  isClosed: boolean
  slug: string
  type: 'discussionQuestion'
}

export interface IDiscussionComment extends IDbDoc {
  _discussionID: string
  // replies will be built recursively from repliesTo field
  replies: IDiscussionComment[]
  // repliesTo references a specific comment ID marked as a reply to
  // if not a reply to another comment by default will be the discussionID
  repliesTo: string
  // comment including images saved as html
  comment: string
  type: 'discussionComment'
}
