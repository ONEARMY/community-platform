export enum EPostFields {
  Avatar = 'avatar',
  TITLE = 'title',
  COMMENTS = '_commentCount',
  UCOUNT = '_usefullCount',
  VCOUNT = '_viewCount',
  TYPE = 'type',
  DATE = '_created',
}
export interface IPostInfos {
  _id: string
  index: number
  avatar: string
  tags: string[]
  date: string
  postTitle: string
  commentCount: number
  viewCount?: number
  usefullCount: number
  postType: string
}

export interface IPostData {
  posts: IPostInfos[]
  meta: any
}
