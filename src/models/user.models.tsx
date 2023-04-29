/* eslint-disable @typescript-eslint/naming-convention*/
import type {
  ISODateString,
  ILocation,
  DBDoc,
  IModerationStatus,
} from './common.models'
import type { UserRole } from 'oa-shared/models'
export type { UserRole }
import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'

export interface IUserState {
  user?: IUser
}

// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields. Note 'email' is excluded
// _uid is unique/fixed identifier
// ALL USER INFO BELOW IS PUBLIC
export interface IUser {
  // authID is additional id populated by firebase auth, required for some auth operations
  _authID: string
  _lastActive?: ISODateString
  // userName is same as legacy 'mention_name', e.g. @my-name. It will also be the doc _id and
  // firebase auth displayName property
  userName: string
  displayName: string
  moderation: IModerationStatus
  // note, user avatar url is taken direct from userName so no longer populated here
  // avatar:string
  verified: boolean
  badges?: IUserBadges
  // images will be in different formats if they are pending upload vs pulled from db
  coverImages: IUploadedFileMeta[] | IConvertedFileMeta[]
  links: IExternalLink[]
  userRoles?: UserRole[]
  about?: string | null
  DHSite_id?: number
  DHSite_mention_name?: string
  country?: string | null
  location?: ILocation | null
  year?: ISODateString
  stats?: IUserStats
  /** keep a map of all howto ids that a user has voted as useful */
  votedUsefulHowtos?: { [howtoId: string]: boolean }
  /** keep a map of all Research ids that a user has voted as useful */
  votedUsefulResearch?: { [researchId: string]: boolean }
  notification_settings?: INotificationSettings
  notifications?: INotification[]
}

export interface IUserBadges {
  verified: boolean
  supporter?: boolean
}

interface IExternalLink {
  key: string
  url: string
  label:
    | 'email'
    | 'website'
    | 'discord'
    | 'bazar'
    | 'forum'
    | 'social media'
    | 'facebook'
    | 'instagram'
}

/**
 * Track the ids and moderation status as summary for user stats
 */
interface IUserStats {
  userCreatedHowtos: { [id: string]: IModerationStatus }
  userCreatedResearch: { [id: string]: IModerationStatus }
  userCreatedEvents: { [id: string]: IModerationStatus }
}

export type IUserDB = IUser & DBDoc

export interface INotification {
  _id: string
  _created: string
  triggeredBy: {
    displayName: string
    userId: string
  }
  relevantUrl?: string
  type: NotificationType
  read: boolean
  notified: boolean
  // email contains the id of the doc in the emails collection if the notification was included in
  // an email or 'failed' if an email with this notification was attempted and encountered an error
  email?: string
}

export const NotificationTypes = [
  'new_comment',
  'howto_useful',
  'howto_mention',
  'new_comment_research',
  'research_useful',
  'research_mention',
  'research_update',
] as const

export type NotificationType = typeof NotificationTypes[number]

export enum EmailNotificationFrequency {
  NEVER = '',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export type INotificationSettings = {
  enabled: {
    [T in NotificationType]: boolean
  }
  emailFrequency: EmailNotificationFrequency
}
