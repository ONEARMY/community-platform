export interface IDatabaseMapPin {
  id: string
  location: ILatLng & {
    address: string
  }
  pinType: string
}

export interface IMapPin {
  id: string
  location: ILatLng & {
    address: string
  }
  pinType: IPinType
}

export interface IMapPinDetail extends IMapPin {
  name: string
  shortDescription: string
  lastActive: Date
  profilePicUrl: string
  profileUrl: string
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
}

export type EntityType = 'individual' | 'place'
