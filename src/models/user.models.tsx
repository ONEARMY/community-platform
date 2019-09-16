import { ISODateString, ILocation, DBDoc } from './common.models'

export interface IUserState {
  user?: IUser
}

export interface ILink {
  label: string
  url: string
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
  // note, user avatar url is taken direct from userName so no longer populated here
  // avatar:string
  verified: boolean
  userRoles?: UserRole[]
  about?: string
  DHSite_id?: number
  DHSite_mention_name?: string
  country?: string
  links?: ILink[]
  location?: ILocation
  year?: ISODateString
}
export type IUserDB = IUser & DBDoc

export type UserRole = 'super-admin' | 'subscriber'
