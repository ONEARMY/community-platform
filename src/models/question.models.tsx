import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'
import type { DBDoc, IModerable, ISharedFeatures } from './common.models'
import type { IQuestionCategory } from './questionCategories.model'
import type { ISelectedTags } from './tags.model'

/**
 * Question retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IQuestionDB = DBDoc & IQuestion.Item

/** All typings related to the Question Module can be found here */
type UserIdList = string[]

export namespace IQuestion {
  /** The main Question item, as created by a user */
  export type Item = {
    _createdBy: string
    _deleted: boolean
    subscribers?: UserIdList
  } & DBDoc &
    FormInput &
    ISharedFeatures

  export interface FormInput extends IModerable {
    title: string
    description: string
    tags: ISelectedTags
    questionCategory?: IQuestionCategory
    slug: string
    previousSlugs?: string[]
    creatorCountry?: string
    allowDraftSave?: boolean
    images?: Array<IUploadedFileMeta | IConvertedFileMeta | null>
  }
}
