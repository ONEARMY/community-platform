export interface IMapPin {
  id: string
  location: {
    lat: number
    lng: number
    address: string
  }
  entityType: EntityType
  pinType: string
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
