import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'
import type { DBDoc, IModerable, ISharedFeatures } from './common.models'
import type { IQuestionCategory } from './questionCategories.model'
import type { ISelectedTags } from './tags.model'

/**
 * Question retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IQuestionDB = DBDoc & IQuestionItem

/** All typings related to the Question Module can be found here */
type UserIdList = string[]

/** The main Question item, as created by a user */
export type IQuestionItem = {
  _createdBy: string
  _deleted: boolean
  subscribers?: UserIdList
  commentCount?: number
} & DBDoc &
  IQuestionFormInput &
  ISharedFeatures

export interface IQuestionFormInput extends IModerable {
  _id: string
  title: string
  description: string
  tags: ISelectedTags
  questionCategory?: IQuestionCategory
  slug: string
  previousSlugs?: string[]
  creatorCountry?: string
  allowDraftSave?: boolean
  images?: (IUploadedFileMeta | IConvertedFileMeta | null)[]
}
