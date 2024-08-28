import type { ProfileTypeName } from 'oa-shared'

type UserBadges = {
  verified: boolean
  supporter: boolean
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

export interface ListItem {
  _id: string
  type: ProfileTypeName
  isVerified?: boolean
  isSupporter?: boolean
  subType?: string
  creator?: IProfileCreator
}
