import {
  ISODateString,
  ILocation,
  DBDoc,
  IModerationStatus,
} from './common.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'

export interface IUserState {
  user?: IUser
}
// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields. Note 'email' is excluded
// _uid is unique/fixed identifier
// ALL USER INFO BELOW IS PUBLIC
export interface IUser {
  // authID is additional id populated by firebase auth, required for some auth operations
  _authID: string
  _lastActive?: ISODateString
  // userName is same as legacy 'mention_name', e.g. @my-name. It will also be the doc _id and
  // firebase auth displayName property
  userName: string
  displayName: string
  moderation: IModerationStatus
  // note, user avatar url is taken direct from userName so no longer populated here
  // avatar:string
  verified: boolean
  // images will be in different formats if they are pending upload vs pulled from db
  coverImages: IUploadedFileMeta[] | IConvertedFileMeta[]
  links: IExternalLink[]
  userRoles?: UserRole[]
  about?: string | null
  DHSite_id?: number
  DHSite_mention_name?: string
  country?: string | null
  location?: ILocation | null
  year?: ISODateString
}

interface IExternalLink {
  url: string
  label:
    | 'email'
    | 'website'
    | 'discord'
    | 'bazar'
    | 'forum'
    | 'social media'
    | 'facebook'
    | 'instagram'
}

export type IUserDB = IUser & DBDoc

export type UserRole = 'super-admin' | 'subscriber' | 'admin'
