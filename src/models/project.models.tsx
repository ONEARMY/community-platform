import { IUser } from './user.models'

export interface IProject {
  id: string
  name: string
  _createdBy: string
  users: IUser[]
  _created: Date
  _modified: Date
}
