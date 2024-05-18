import type {
  EmailNotificationFrequency,
  ExternalLinkLabel,
  IModerationStatus,
  NotificationType,
  PatreonUser,
  UserRole,
} from 'oa-shared'
import type { DBDoc, ILocation, ISODateString } from './common.models'

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
  notification_settings?: INotificationSettings
  notifications?: INotification[]
  profileCreated?: ISODateString
  profileCreationTrigger?: string
  // Used to generate an encrypted unsubscribe url in emails
  unsubscribeToken?: string
  impact?: IUserImpact
  isBlockedFromMessaging?: boolean
  isContactableByPublic?: boolean
  patreon?: PatreonUser | null
}

export interface IUserImpact {
  [key: number]: IImpactYearFieldList
}

export interface IImpactDataField {
  id: string
  value: number
  isVisible: boolean
}

export type IImpactYearFieldList = IImpactDataField[]

export type IImpactYear = 2019 | 2020 | 2021 | 2022 | 2023

export interface IUserBadges {
  verified?: boolean
  supporter?: boolean
}

interface IExternalLink {
  key: string
  url: string
  label: ExternalLinkLabel
}

/**
 * Track the ids and moderation status as summary for user stats
 */
interface IUserStats {
  userCreatedHowtos: { [id: string]: IModerationStatus }
  userCreatedResearch: { [id: string]: IModerationStatus }
  userCreatedComments: { [id: string]: string | null }
}

export type IUserDB = IUser & DBDoc

export interface INotification {
  _id: string
  _created: string
  triggeredBy: {
    displayName: string
    // this field is the userName of the user, which we use as a unique id as of https://github.com/ONEARMY/community-platform/pull/2479/files
    userId: string
  }
  relevantUrl?: string
  type: NotificationType
  read: boolean
  notified: boolean
  // email contains the id of the doc in the emails collection if the notification was included in
  // an email or 'failed' if an email with this notification was attempted and encountered an error
  email?: string
  title?: string
}

export type INotificationSettings = {
  enabled?: {
    [T in NotificationType]: boolean
  }
  emailFrequency: EmailNotificationFrequency
}

export type INotificationUpdate = {
  _id: string
  notifications?: INotification[]
}
