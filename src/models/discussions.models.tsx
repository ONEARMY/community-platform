export interface IDiscussionQuestion {
  _id: string
  _created: Date
  _modified: Date
  _lastResponse: Date | null
  _commentCount: number
  _viewCount: number
  _usefullCount: number
  _last3Comments: any
  // user id only saved for created by
  createdBy: string
  tags: string[]
  title: string
  content: string
  type: 'discussionQuestion'
}

export interface IDiscussionComment {
  _id: string
  _discussionID: string
  _created: Date
  _modified: Date
  // replies will be built recursively from repliesTo field
  replies: IDiscussionComment[]
  // repliesTo references a specific comment ID marked as a reply to
  // if not a reply to another comment by default will be the discussionID
  repliesTo: string
  // comment including images saved as html
  comment: string
  type: 'discussionComment'
}
