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
// _id is unique/fixed identifier
// ALL USER INFO BELOW IS PUBLIC
export interface IUser extends IDbDoc {
  _id: string
  verified: boolean
  avatar: string
  about?: string
  mention_name?: string
  display_name?: string
  legacy_id?: number
  legacy_registered?: string /*mm/dd/yyyy hh:ss*/
  first_name?: string
  last_name?: string
  nickname?: string
  country?: string
}
