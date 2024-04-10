import type { DBDoc } from './common.models'
import type { IUser } from './user.models'

export type IMessageDB = DBDoc & IMessage

export interface IMessage extends IMessageInput {
  isSent: boolean
}

export interface IMessageInput {
  email: string
  text: string
  toUserName: IUser['userName']
  name?: string
}
