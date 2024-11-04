import type { ILatLng } from './common'
import type { IModerationStatus } from './moderation'
import type { ITag } from './tags'
import type { IUserBadges, ProfileTypeName, WorkspaceType } from './user'

/**
 * Map pins have a `type` which correspond to icon
 * They can also optionally have a subtype for additional filtering
 */
export interface IMapPin {
  moderation: IModerationStatus
  _createdBy?: string
  _id: string
  _deleted: boolean
  type: ProfileTypeName
  location: ILatLng
  verified: boolean
  subType?: WorkspaceType // For old map
  comments?: string
  creator?: IProfileCreator
}

/**
 * @param detail - by default details are pulled on pin open, using
 * the pin _id param as the user profile ID required for lookup
 */
export interface IMapPinWithDetail extends IMapPin {
  detail: IMapPinDetail
}

export interface IMapGrouping {
  _count?: number
  grouping: IPinGrouping
  displayName: string
  type: ProfileTypeName
  subType?: WorkspaceType
  icon: string
  hidden?: boolean
}

export interface IBoundingBox {
  _northEast: ILatLng
  _southWest: ILatLng
}

export enum IPinGrouping {
  INDIVIDUAL = 'individual',
  PLACE = 'place',
}

export interface IMapPinDetail {
  country: string | null
  displayName?: string
  heroImageUrl: string
  name: string
  profilePicUrl: string
  profileUrl: string
  shortDescription: string
  verifiedBadge?: boolean
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
  tags?: ITag[]
  workspaceType?: string
  userImage?: string
}

// Overlap with IWorkspaceType
export interface MapFilterOption {
  _id: string
  label: string
  filterType: string
  imageSrc?: string
}

export type MapFilterOptionsList = MapFilterOption[]
