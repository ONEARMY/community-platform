import { ResearchStatus } from '@onearmy.apps/shared'

import type { ResearchUpdateStatus } from '@onearmy.apps/shared'
import type { DBDoc } from '../stores/databaseV2/types'
import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'
import type { IModerable, ISharedFeatures, UserMention } from './common.models'
import type { IResearchCategory } from './researchCategories.model'
import type { ISelectedTags } from './tags.model'

/**
 * Research retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IResearchDB = DBDoc & IResearchItemDB

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

/** The main research item, as created by a user */
export type IResearchItem = {
  updates: IResearchUpdate[]
  mentions?: UserMention[]
  _createdBy: string
  collaborators: string[]
  subscribers?: UserIdList
  locked?: ResearchDocumentLock
  totalUpdates?: number
  totalUsefulVotes?: number
  totalCommentCount: number
  keywords?: string[]
} & Omit<IResearchFormInput, 'collaborators'> &
  DBDoc

/** A research item update */
export type IResearchUpdate = {
  title: string
  description: string
  images: Array<IUploadedFileMeta | IConvertedFileMeta | File | null>
  files: Array<IUploadedFileMeta | File | null>
  fileLink: string
  downloadCount: number
  videoUrl?: string
  collaborators?: string[]
  status: ResearchUpdateStatus
  researchStatus?: ResearchStatus
  locked?: ResearchDocumentLock
  _id: string
} & DBDoc

export interface IResearchFormInput extends IModerable, ISharedFeatures {
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
export type IResearchItemDB = Omit<IResearchItem, 'updates'> & {
  totalCommentCount: number
  updates: IResearchUpdateDB[]
} & DBDoc

export type IResearchUpdateDB = IResearchUpdate & DBDoc
