import type { IUser } from 'oa-shared'

export interface IProject {
  id: string
  name: string
  _createdBy: string
  users: IUser[]
  _created: Date
  _modified: Date
}
