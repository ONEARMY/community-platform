import type { ILatLng } from './common'
import type { IModerationStatus } from './moderation'
import type { IProfileCreator, ProfileTypeName } from './user'
import type { WorkspaceType } from './userPreciousPlastic'

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
  subType?: IMapPinSubtype
  comments?: string
  creator?: IProfileCreator
}

/**
 * Map pins keep minimal information required for pin display.
 * @param _id - The id that will be used to pull pin details
 * currently this is a user profile id
 * @param type - Pin type icon to use - currently mapped to profile types
 * @param subtype - currently used for workspacetype filtering
 */

export type IMapPinSubtype = WorkspaceType

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
  subType?: IMapPinSubtype
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
