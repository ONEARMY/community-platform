import type { IProfileCreator, ProfileTypeName } from 'oa-shared'

export interface ListItem {
  _id: string
  type: ProfileTypeName
  isVerified?: boolean
  isSupporter?: boolean
  subType?: string
  creator?: IProfileCreator
}
