import type { ILocation, ISODateString } from './common'
import type { DBDoc } from './db'
import type { IModerationStatus } from './moderation'
import type { INotification, INotificationSettings } from './notifications'
import type { IPatreonUser } from './patreon'
import type { IUploadedFileMeta } from './storage'

/* eslint-disable @typescript-eslint/naming-convention */
export enum UserRole {
  SUBSCRIBER = 'subscriber',
  ADMIN = 'admin',
  BETA_TESTER = 'beta-tester',
  RESEARCH_CREATOR = 'research_creator',
}

export enum ExternalLinkLabel {
  EMAIL = 'email',
  WEBSITE = 'website',
  DISCORD = 'discord',
  BAZAR = 'bazar',
  FORUM = 'forum',
  SOCIAL_MEDIA = 'social media',
}

export type IUserDB = IUser & DBDoc

export const ProfileTypeList = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

export type ProfileTypeName =
  (typeof ProfileTypeList)[keyof typeof ProfileTypeList]

export type MemberOrSpace =
  | (typeof ProfileTypeList)['MEMBER']
  | (typeof ProfileTypeList)['SPACE']

// Below are primarily used for PP

export type WorkspaceType =
  | 'shredder'
  | 'sheetpress'
  | 'extrusion'
  | 'injection'
  | 'mix'

export interface IProfileType {
  label: ProfileTypeName
  imageSrc?: string
  cleanImageSrc?: string
  cleanImageVerifiedSrc?: string
  textLabel?: string
}
export interface IWorkspaceType {
  label: WorkspaceType
  imageSrc?: string
  textLabel: string
  subText?: string
}

export type UserMention = {
  username: string
  location: string
}

export type UserVisitorPreferencePolicy =  'open' | 'appointment' | 'closed'

export type UserVisitorPreference = {
  policy: UserVisitorPreferencePolicy,
  details?: string
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
  verified: boolean
  badges?: IUserBadges
  // images will be in different formats if they are pending upload vs pulled from db
  coverImages: IUploadedFileMeta[]
  userImage?: IUploadedFileMeta
  links?: IExternalLink[]
  userRoles?: UserRole[]
  about?: string | null
  country?: string | null
  location?: ILocation | null
  year?: ISODateString
  stats?: IUserStats
  notification_settings?: INotificationSettings
  notifications?: INotification[]
  profileCreated?: ISODateString
  profileCreationTrigger?: string
  // Used to generate an encrypted unsubscribe url in emails
  unsubscribeToken?: string | null
  impact?: IUserImpact
  isBlockedFromMessaging?: boolean
  isContactableByPublic?: boolean
  patreon?: IPatreonUser | null
  totalUseful?: number
  total_views?: number
  openToVisitors?: UserVisitorPreference

  // New generic profile field for all profile types
  tags?: { [key: string]: boolean }

  // Primary PP profile type related fields
  profileType: ProfileTypeName
  workspaceType?: WorkspaceType | null // <-- to-do replace with tags
  mapPinDescription?: string | null
}

export interface IUserBadges {
  verified?: boolean
  supporter?: boolean
}

export interface IExternalLink {
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
  userCreatedQuestions: { [id: string]: IModerationStatus }
  userCreatedComments: { [id: string]: string | null }
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

export type IImpactYear = 2019 | 2020 | 2021 | 2022 | 2023 | 2024

export type INotificationUpdate = {
  _id: string
  notifications?: INotification[]
}
