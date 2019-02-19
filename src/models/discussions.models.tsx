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

// // The discussion question class can be used to generate a new discussion object,
// // and contains common methods for discussion objects
// export class DiscussionQuestion {
//   public value: IDiscussionQuestion
//   constructor(values?: IDiscussionQuestion) {
//     this._init(values)
//   }
//   // when initialising a question either load existing data or generate placeholder
//   private _init(values?: IDiscussionQuestion) {
//     this.value = values
//       ? values
//       : {
//           _commentCount: 0,
//           _created: new Date(),
//           _id: 'WILL GENERATE',
//           _last3Comments: [],
//           _lastResponse: null,
//           _modified: new Date(),
//           _usefullCount: 0,
//           _viewCount: 0,
//           createdBy: '',
//           postTitle: '',
//           postType: 'discussion',
//           tags: [],
//         }
//   }
// }
