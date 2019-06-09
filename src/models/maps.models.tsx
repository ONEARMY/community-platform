export interface IMapPin {
  id: string
  location: ILatLng & {
    address: string
  }
  entityType: EntityType
  pinType: string
}

export interface ILatLng {
  lat: number
  lng: number
}

export interface IBoundingBox {
  topLeft: ILatLng
  bottomRight: ILatLng
}

export type EntityType = 'individual' | 'place'
export type PinType =
  | 'workspace'
  | 'shredder'
  | 'extrustion'
  | 'press'
  | 'research'
  | 'member'
  | 'community'
  | 'builder'
