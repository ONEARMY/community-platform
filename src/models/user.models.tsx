import { IDbDoc } from './common.models'

export interface IUserState {
  user?: IUser
}

// user form input can take any user profile fields, not necessary to have standalone
// but keeping to make overt.
// tslint:disable no-empty-interface
export interface IUserFormInput extends Partial<IUser> {}

// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields. Note 'email' is excluded
// _uid is unique/fixed identifier
// ALL USER INFO BELOW IS PUBLIC
export interface IUser extends IDbDoc {
  // authID is additional id populated by firebase auth, required for some auth operations
  _authID: string
  // userName is same as legacy 'mention_name', e.g. @my-name. It will also be the doc _id and
  // firebase auth displayName property
  userName: string
  // note, user avatar url is taken direct from userName so no longer populated here
  // avatar:string
  verified: boolean
  about?: string
  legacy_id?: number
  legacy_registered?: string /*mm/dd/yyyy hh:ss*/
  country?: string
}
