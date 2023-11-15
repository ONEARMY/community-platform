import type { DBDoc, IUser } from '.'

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
