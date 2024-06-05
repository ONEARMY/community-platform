import { createContext, useContext } from 'react'
import { logger } from 'src/logger'
import { isUserBlockedFromMessaging } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'

import type { IMessage, IMessageInput } from 'src/models'
import type { IRootStore } from '../RootStore'

const COLLECTION_NAME = 'messages'
const EMAIL_ADDRESS_SEND_LIMIT = 100

export class MessageStore extends ModuleStore {
  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
  }

  public async upload(values: IMessageInput) {
    const messagesByEmailer = await this.messagesByEmailer(values.email)
    if (messagesByEmailer.length >= EMAIL_ADDRESS_SEND_LIMIT) {
      logger.error('Too many messages sent', values)

      const error = new Error('Too many messages sent')
      return Promise.reject(error)
    }

    const isUserBlocked = isUserBlockedFromMessaging(this.activeUser)
    if (isUserBlocked) {
      logger.error('User blocked from messaging', values)

      const error = new Error('Blocked from messaging')
      return Promise.reject(error)
    }

    try {
      return await this.db
        .collection<IMessage>(COLLECTION_NAME)
        .doc()
        .set({ isSent: false, ...values })
    } catch (error) {
      logger.error(error)
      return error
    }
  }

  private async messagesByEmailer(email: string): Promise<[]> {
    return await this.db
      .collection<IMessage>(COLLECTION_NAME)
      .getWhere('email', '==', email)
  }
}

export const MessageStoreContext = createContext<MessageStore>(null as any)
export const useMessageStore = () => useContext(MessageStoreContext)
