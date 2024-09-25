import type { ILatLng, ISODateString } from './common'
import type { DBDoc } from './db'
import type { IModerationStatus } from './moderation'
import type { INotification, INotificationSettings } from './notifications'
import type { IUploadedFileMeta } from './storage'

/* eslint-disable @typescript-eslint/naming-convention */
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  SUBSCRIBER = 'subscriber',
  ADMIN = 'admin',
  BETA_TESTER = 'beta-tester',
  RESEARCH_EDITOR = 'research_editor',
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

// See https://docs.patreon.com/?javascript#user-v2
export interface PatreonUserAttributes {
  about: string
  created: string
  email: string
  first_name: string
  full_name: string
  image_url: string
  last_name: string
  thumb_url: string
  url: string
}

// See https://docs.patreon.com/#member
export interface PatreonMembershipAttributes {
  campaign_lifetime_support_cents: number
  currently_entitled_amount_cents: number
  is_follower: boolean
  last_charge_date: string
  last_charge_status: string
  lifetime_support_cents: number
  next_charge_date: string
  note: string
  patron_status: string
  pledge_cadence: string
  pledge_relationship_start: string
  will_pay_amount_cents: number
}

// See https://docs.patreon.com/#tier
export interface PatreonTierAttributes {
  amount_cents: number
  created_at: string
  description: string
  edited_at: string
  image_url: string
  patron_count: number
  published: boolean
  published_at: string
  title: string
  url: string
}

interface PatreonTier {
  id: string
  attributes: PatreonTierAttributes
}

interface PatreonMembership {
  id: string
  attributes: PatreonMembershipAttributes
  tiers: PatreonTier[]
}

export interface PatreonUser {
  id: string
  attributes: PatreonUserAttributes
  link: string
  membership?: PatreonMembership
}

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

export interface IUserBadges {
  verified?: boolean
  supporter?: boolean
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

export interface IExternalLink {
  key: string
  url: string
  label: ExternalLinkLabel
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
  coverImages: IUploadedFileMeta[]
  userImage?: IUploadedFileMeta
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
  unsubscribeToken?: string | null
  impact?: IUserImpact
  isBlockedFromMessaging?: boolean
  isContactableByPublic?: boolean
  patreon?: PatreonUser | null
  totalUseful?: number
}
export type IUserDB = IUser & DBDoc

export interface IImpactDataField {
  id: string
  value: number
  isVisible: boolean
}

export type IImpactYearFieldList = IImpactDataField[]

export interface IUserImpact {
  [key: number]: IImpactYearFieldList
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

export interface IProfileCreator {
  _id: string
  _lastActive: string
  about?: string
  badges?: IUserBadges
  countryCode: string
  coverImage?: string
  displayName: string
  isContactableByPublic: boolean
  profileType: ProfileTypeName
  subType?: string
  userImage?: string
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
