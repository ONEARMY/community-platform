import type { IConvertedFileMeta } from '../types'
import type { DBDoc, IComment, IModerable, ISelectedTags, UserMention } from '.'
import type { IUploadedFileMeta } from '../stores/storage'
import type { IResearchCategory } from './researchCategories.model'

/**
 * Research retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IResearchDB = DBDoc & IResearch.ItemDB

export type IResearchStats = {
  votedUsefulCount: number
}

type UserIdList = string[]

/** All typings related to the Research Module can be found here */
export namespace IResearch {
  /** The main research item, as created by a user */
  export type Item = {
    updates: Update[]
    mentions?: UserMention[]
    _createdBy: string
    total_views?: number
    collaborators: string[]
    subscribers?: UserIdList
  } & Omit<FormInput, 'collaborators'>

  /** A research item update */
  export interface Update {
    title: string
    description: string
    images: Array<IUploadedFileMeta | IConvertedFileMeta | null>
    videoUrl?: string
    comments?: IComment[]
    total_views?: number
    collaborators?: string[]
    status: 'draft' | 'published'
  }

  export interface FormInput extends IModerable {
    title: string
    description: string
    researchCategory?: IResearchCategory
    slug: string
    tags: ISelectedTags
    creatorCountry?: string
    collaborators: string
  }

  /** Research items synced from the database will contain additional metadata */
  // Use of Omit to override the 'updates' type to UpdateDB
  export type ItemDB = Omit<Item, 'updates'> & {
    updates: UpdateDB[]
  } & DBDoc

  export type UpdateDB = Update & DBDoc
}
