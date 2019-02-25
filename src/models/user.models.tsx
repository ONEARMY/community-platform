import { IProject } from './project.models'

export class User {
  constructor() {
    //
  }

  _listenToLoginState() {
    console.log('listening to login state')
  }
}
export interface IUserState {
  user?: IUser
}

export interface IUserFormInput {
  login: string
  email: string
  display_name: string
  password?: string
  repeat_password?: string
  first_name?: string
  last_name?: string
  nickname?: string
  country?: string
}

// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields
export interface IUser {
  projects?: IProject
  verified: boolean
  _created: Date
  _modified: Date
  login: string
  email: string
  display_name: string
  legacy_id?: number
  legacy_registered?: string /*mm/dd/yyyy hh:ss*/
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
