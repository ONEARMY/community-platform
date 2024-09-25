import type { IConvertedFileMeta } from './common'
import type { DBDoc } from './db'
import type { IModerable } from './moderation'
import type { IUploadedFileMeta } from './storage'
import type { ISelectedTags } from './tags'
import type { UserMention } from './user'
import type { ISharedFeatures } from './voteUseful'

export enum ResearchStatus {
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum ResearchUpdateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

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
    collaborators: string[]
    subscribers?: UserIdList
    locked?: ResearchDocumentLock
    totalUpdates?: number
    totalUsefulVotes?: number
    totalCommentCount: number
    keywords?: string[]
  } & Omit<FormInput, 'collaborators'> &
    DBDoc

  /** A research item update */
  export type Update = {
    title: string
    description: string
    images: Array<IUploadedFileMeta | IConvertedFileMeta | File | null>
    files: Array<IUploadedFileMeta | File | null>
    fileLink: string
    downloadCount: number
    videoUrl?: string
    collaborators?: string[]
    commentCount?: number
    status?: ResearchUpdateStatus
    researchStatus?: ResearchStatus
    locked?: ResearchDocumentLock
    _id: string
  } & DBDoc

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

export type ISelectedResearchCategories = Record<string, boolean>

export interface IResearchCategory extends DBDoc {
  label: string
}
