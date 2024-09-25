import type { INotification, IUser, UserRole } from 'oa-shared'

export type { UserRole }

export interface IUserState {
  user?: IUser
}

export type IImpactYear = 2019 | 2020 | 2021 | 2022 | 2023

export type INotificationUpdate = {
  _id: string
  notifications?: INotification[]
}
