import { DBDoc, ISODateString } from './common.models'
import { WorkspaceType, ProfileTypeLabel } from './user_pp.models'

interface IMapPinBase {
  _id: string
  location: ILatLng & {
    address: string
  }

  workspaceType?: WorkspaceType
  profileType?: ProfileTypeLabel
}
export interface IMapPin extends IMapPinBase {
  pinType: string
}

export interface IMapPinWithType extends IMapPinBase {
  pinType: IPinType
}

export interface IMapPinDetail extends IMapPin {
  name: string
  shortDescription: string
  lastActive: ISODateString
  profilePicUrl: string
  profileUrl: string
  heroImageUrl: string
}

export interface ILatLng {
  lat: number
  lng: number
}

export interface IBoundingBox {
  topLeft: ILatLng
  bottomRight: ILatLng
}

export interface IPinType {
  displayName: string
  name: string
  grouping: EntityType
  icon: string
  count: number
  visible?: boolean
}

export type EntityType = 'individual' | 'place'
