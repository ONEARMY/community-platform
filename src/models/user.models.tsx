import { IProject } from './models'

export interface IUserState {
  user?: IUser
}
export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  projects?: IProject
  verified: boolean
  altName?: string
  address?: IAddress
  _created: Date
  _modified: Date
}

interface IAddress {
  country: string
  postcode: string
  street: string
  flatNumber?: number
}
