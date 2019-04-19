import { IProject } from './project.models'
import { IDbDoc } from './common.models'
import { IFirebaseUploadInfo } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'

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
  email: string
  display_name?: string
  password?: string
  repeat_password?: string
  first_name?: string
  last_name?: string
  nickname?: string
  country?: string
  avatar?: string | IFirebaseUploadInfo
}

// IUser retains most of the fields from legacy users (omitting passwords),
// and has a few additional fields. Note 'email' is excluded
// _id is unique/fixed identifier
// ALL USER INFO BELOW IS PUBLIC
export interface IUser extends IDbDoc {
  _id: string
  verified: boolean
  avatar: string
  mention_name?: string
  display_name?: string
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
