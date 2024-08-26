export interface IBoundingBox {
  _northEast: ILatLng
  _southWest: ILatLng
}

export enum IPinGrouping {
  INDIVIDUAL = 'individual',
  PLACE = 'place',
}

export interface ILatLng {
  lat: number
  lng: number
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
