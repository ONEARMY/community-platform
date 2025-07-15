import type { INotification } from './notifications'

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

// Below are primarily used for PP

export type WorkspaceType =
  | 'shredder'
  | 'sheetpress'
  | 'extrusion'
  | 'injection'
  | 'mix'

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

export const userVisitorPreferencePolicies = [
  'open',
  'appointment',
  'closed',
] as const

export type UserVisitorPreferencePolicy =
  (typeof userVisitorPreferencePolicies)[number]

export type UserVisitorPreference = {
  policy: UserVisitorPreferencePolicy
  details?: string | null
}

export interface IUserBadges {
  verified?: boolean
  supporter?: boolean
}

export interface IExternalLink {
  url: string
  label: ExternalLinkLabel
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
