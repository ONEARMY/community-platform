import { firestore } from 'firebase/app'

export interface IDiscussionPost extends IPostFormInput {
  _id: string
  _created: firestore.Timestamp
  _modified: firestore.Timestamp
  _lastResponse: firestore.Timestamp | null
  _commentCount: number
  _viewCount: number
  _usefullCount: number
  _last3Comments: any
  // user id only saved for created by
  createdBy: string
  isClosed: boolean
  tags: string[]
  slug: string
  type: 'discussionQuestion'
}

export interface IDiscussionComment {
  _id: string
  _discussionID: string
  _created: firestore.Timestamp
  _modified: firestore.Timestamp
  // replies will be built recursively from repliesTo field
  replies: IDiscussionComment[]
  // repliesTo references a specific comment ID marked as a reply to
  // if not a reply to another comment by default will be the discussionID
  repliesTo: string
  // comment including images saved as html
  comment: string
  type: 'discussionComment'
}

export interface IPostFormInput {
  title: string
  content: string
}
