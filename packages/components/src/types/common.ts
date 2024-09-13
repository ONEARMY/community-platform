import type { IProfileCreator, ProfileTypeName } from 'oa-shared'

export type User = {
  userName: string
  countryCode?: string | null
  isSupporter?: boolean
  isVerified?: boolean
}

export interface MapListItem {
  _id: string
  type: ProfileTypeName
  isVerified?: boolean
  isSupporter?: boolean
  subType?: string
  creator?: IProfileCreator
}
