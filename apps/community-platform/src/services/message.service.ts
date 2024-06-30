import { getFunctions, httpsCallable } from 'firebase/functions'

import type { SendMessage } from '@onearmy.apps/shared'

const functions = getFunctions()

const sendMessageFunction = httpsCallable(functions, 'sendMessage')

const sendMessage = async (data: SendMessage) => {
  await sendMessageFunction(data)
}

export const messageService = {
  sendMessage,
}
