import type { IModerationStatus, IPinGrouping } from 'oa-shared'
import type { ProfileTypeLabel } from '../modules/profile/types'
import type { WorkspaceType } from './userPreciousPlastic.models'

/**
 * Map pins keep minimal information required for pin display.
 * @param _id - The id that will be used to pull pin details
 * currently this is a user profile id
 * @param type - Pin type icon to use - currently mapped to profile types
 * @param subtype - currently used for workspacetype filtering
 */

export type IMapPinType = ProfileTypeLabel
export type IMapPinSubtype = WorkspaceType

/**
 * Map pins have a `type` which correspond to icon
 * They can also optionally have a subtype for additional filtering
 */
export interface IMapPin {
  moderation: IModerationStatus
  _createdBy?: string
  _id: string
  _deleted: boolean
  type: IMapPinType
  location: ILatLng
  verified: boolean
  subType?: IMapPinSubtype
  comments?: string
}

/**
 * @param detail - by default details are pulled on pin open, using
 * the pin _id param as the user profile ID required for lookup
 */
export interface IMapPinWithDetail extends IMapPin {
  detail: IMapPinDetail
}

export interface IMapPinDetail {
  name: string
  displayName: string
  shortDescription: string
  profilePicUrl: string
  profileUrl: string
  heroImageUrl: string
  verifiedBadge: boolean
  country: string | null
}

export interface ILatLng {
  lat: number
  lng: number
}

export interface IBoundingBox {
  topLeft: ILatLng
  bottomRight: ILatLng
}

export interface IMapGrouping {
  _count?: number
  grouping: IPinGrouping
  displayName: string
  type: IMapPinType
  subType?: IMapPinSubtype
  icon: string
  hidden?: boolean
}
