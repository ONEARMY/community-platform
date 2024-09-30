import type { DBDoc } from './db'
import type { IUser } from './user'

export type SendMessage = {
  to: string
  message: string
  name: string
}

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
