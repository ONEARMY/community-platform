import { IDbDoc, ISODateString } from './common.models'

interface IMapPinBase {
  _id: string
  location: ILatLng & {
    address: string
  }
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
}

export type EntityType = 'individual' | 'place'
