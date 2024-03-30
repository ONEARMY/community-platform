import { ResearchStatus } from 'oa-shared'

import type { ResearchUpdateStatus } from 'oa-shared'
import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'
import type {
  DBDoc,
  IComment,
  IModerable,
  ISelectedTags,
  ISharedFeatures,
  UserMention,
} from '.'
import type { IResearchCategory } from './researchCategories.model'

/**
 * Research retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IResearchDB = DBDoc & IResearch.ItemDB

export type IResearchStats = {
  votedUsefulCount: number
}

type UserId = string
type DateString = string

type ResearchDocumentLockInformation = {
  by: UserId
  at: DateString
}

type ResearchDocumentLock = ResearchDocumentLockInformation | null

export const researchStatusOptions = (
  Object.keys(ResearchStatus) as (keyof typeof ResearchStatus)[]
).map((status) => {
  return {
    label: ResearchStatus[status],
    value: ResearchStatus[status],
  }
})

type UserIdList = UserId[]

export namespace IResearch {
  /** The main research item, as created by a user */
  export type Item = {
    updates: Update[]
    mentions?: UserMention[]
    _createdBy: string
    _deleted: boolean
    collaborators: string[]
    subscribers?: UserIdList
    locked?: ResearchDocumentLock
    totalUpdates?: number
    totalUsefulVotes?: number
  } & Omit<FormInput, 'collaborators'>

  /** A research item update */
  export interface Update {
    title: string
    description: string
    images: Array<IUploadedFileMeta | IConvertedFileMeta | File | null>
    files: Array<IUploadedFileMeta | File | null>
    fileLink: string
    downloadCount: number
    videoUrl?: string
    comments?: IComment[]
    collaborators?: string[]
    status: ResearchUpdateStatus
    researchStatus?: ResearchStatus
    locked?: ResearchDocumentLock
  }

  export interface FormInput extends IModerable, ISharedFeatures {
    title: string
    description: string
    researchCategory?: IResearchCategory
    slug: string
    tags: ISelectedTags
    creatorCountry?: string
    collaborators: string
    previousSlugs?: string[]
    researchStatus?: ResearchStatus
  }

  /** Research items synced from the database will contain additional metadata */
  // Use of Omit to override the 'updates' type to UpdateDB
  export type ItemDB = Omit<Item, 'updates'> & {
    totalCommentCount: number
    updates: UpdateDB[]
  } & DBDoc

  export type UpdateDB = Update & DBDoc
}
