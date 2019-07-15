import { IDbDoc, ITimestamp } from './common.models'

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
/***************************************************************************
 *  NOTE - ALL USER INFO BELOW IS PUBLIC
 ****************************************************************************/
export interface IUser extends IDbDoc {
  // authID is additional id populated by firebase auth, required for some auth operations
  _authID: string
  // want to track active status, however requires upgrade of users in db if want non-optional here
  _lastActive?: ITimestamp
  // userName is same as legacy 'mention_name', e.g. @my-name. It will also be the doc _id and
  // firebase auth displayName property
  userName: string
  // NOTE, user avatar url is taken direct from userName so no longer populated here
  // avatar:string
  verified: boolean
  userRoles?: UserRole[]
  about?: string
  DHSite_id?: number
  DHSite_mention_name?: string
  // NOTE, country no longer stored as location includes field
  country?: string
  links?: ILink[]
  // NOTE, user location is stored in the users map pin, and kept out of profile to avoid duplication
  // location?: ILocation
  year?: ITimestamp
}

export type UserRole = 'super-admin' | 'subscriber'
