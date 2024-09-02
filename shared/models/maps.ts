import type { ProfileTypeName } from './user'

type UserBadges = {
  verified: boolean
  supporter: boolean
}

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

export interface IProfileCreator {
  _id: string
  _lastActive: string
  about?: string
  badges?: UserBadges
  countryCode: string
  coverImage?: string
  displayName: string
  isContactableByPublic: boolean
  profileType: ProfileTypeName
  subType?: string
  userImage?: string
}
