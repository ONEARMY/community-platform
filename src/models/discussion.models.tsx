import type { IQuestion } from './question.models'

export type IComment = {
  _id: string
  _created: string
  _creatorId: string
  _deleted?: boolean
  _edited?: string
  creatorName: string
  parentCommentId: string | null
  text: string
  creatorCountry?: string | null
  isEditable?: boolean
  isUserSupporter?: boolean
  isUserVerified?: boolean
}

export type IDiscussion = {
  _id: string
  comments: IComment[]
  contributorIds: string[]
  primaryContentId?: string | undefined
  sourceId: string
  sourceType: 'howto' | 'question' | 'researchUpdate'
}

export type IDiscussionSourceModelOptions = IQuestion.Item
