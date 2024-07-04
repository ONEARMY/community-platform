import type { DBDoc } from '../stores/databaseV2/types'
import type { IQuestionItem } from './question.models'

export type IComment = {
  _id: string
  _created: string
  _creatorId: string
  _deleted?: boolean
  _edited?: string
  parentCommentId: string | null
  text: string
  creatorName: string
  creatorCountry?: string | null
  creatorImage?: string | null
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

export type IDiscussionDB = IDiscussion & DBDoc

export type IDiscussionSourceModelOptions = IQuestionItem
