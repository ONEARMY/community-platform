import type { IConvertedFileMeta } from './common'
import type { DBDoc } from './db'
import type { IModerable } from './moderation'
import type { IUploadedFileMeta } from './storage'
import type { ISelectedTags } from './tags'
import type { ISharedFeatures } from './voteUseful'

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
    commentCount?: number
  } & DBDoc &
    FormInput &
    ISharedFeatures

  export interface FormInput extends IModerable {
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
}

export type ISelectedQuestionCategories = Record<string, boolean>

export interface IQuestionCategory extends DBDoc {
  label: string
}
