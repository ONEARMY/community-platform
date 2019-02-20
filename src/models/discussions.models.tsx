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
  postTitle: string
  postType: 'discussion'
}

export interface IDiscussionComment {
  _id: string
  _discussionID: string
  _created: Date
  _modified: Date
  replies: IDiscussionComment[]
  // comment including images saved as html
  comment: string
}
