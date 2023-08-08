// re-imports and re-exports
import type { DBEndpoint } from '../stores/databaseV2/endpoints'
import type { DBDoc as DBDocImport } from '../stores/databaseV2/types'
export type DBDoc = DBDocImport
export { DB_ENDPOINTS } from '../stores/databaseV2/endpoints'
export type IDBEndpoint = DBEndpoint

// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

// Types for moderation status
export type IModerationStatus =
  | 'draft'
  | 'awaiting-moderation'
  | 'improvements-needed'
  | 'rejected'
  | 'accepted'

export interface IModerationFeedback {
  feedbackTimestamp: ISODateString
  feedbackComments: string
  adminUsername: string
}
export interface IModeration {
  moderation: IModerationStatus
  moderationFeedback?: IModerationFeedback[]
}
export interface IModerable extends IModeration {
  _createdBy?: string
  _id?: string
}

export type UserMention = {
  username: string
  location: string
}

export type Collaborator = {
  countryCode?: string | null
  userName: string
  isVerified: boolean
}

export interface ILocation {
  name: string
  country: string
  countryCode: string
  administrative: string
  latlng: ILatLng
  postcode: string
  value: string
}
interface ILatLng {
  lat: number
  lng: number
}

export interface IVotedUseful {
  votedUsefulBy?: string[]
}
export interface ISharedFeatures extends IVotedUseful {
  total_views?: number
  previousSlugs?: string[]
}

export type IVotedUsefulUpdate = {
  _id: string
} & IVotedUseful

export type IModerationUpdate = {
  _id: string
} & IModeration
