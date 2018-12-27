import { IProject } from './models'

export interface IUserState {
  user?: IUser
}

// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields
export interface IUser {
  projects?: IProject
  verified: boolean
  _created: Date
  _modified: Date
  legacy_id: number
  login: string
  email: string
  legacy_registered: string /*mm/dd/yyyy hh:ss*/
  display_name: string
  first_name?: string
  last_name?: string
  nickname?: string
  country?: string
}

export interface ILegacyUser {
  legacy_id: number
  login: string
  password: string
  password_alg: 'phpass' | 'md5'
  email?: string
  legacy_registered: string /*mm/dd/yyyy hh:ss*/
  display_name: string
  first_name?: string
  last_name?: string
  nickname?: string
  country?: string
}
