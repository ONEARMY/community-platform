export interface IMapPin {
  id: string
  location: ILatLng & {
    address: string
  }
  entityType: EntityType
  pinType: PinType
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
  | 'injector'
  | 'shredder'
  | 'extruder'
  | 'press'
  | 'research'
  | 'member'
  | 'community'
  | 'builder'
