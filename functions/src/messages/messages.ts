import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from '../models'
import { firebaseAdmin } from '../Firebase/admin'
import { createDoc } from '../Utils/doc.utils'

import type { SendMessage } from 'oa-shared'

const EMAIL_ADDRESS_SEND_LIMIT = 100

const isBlocked = async (uid: string) => {
  const userReq = await firebaseAdmin
    .firestore()
    .collection(DB_ENDPOINTS.users)
    .where('_authID', '==', uid)
    .get()

  const user = userReq.docs[0].data()

  return !!user.isBlockedFromMessaging
}

const reachedLimit = async (email: string) => {
  const userReq = await firebaseAdmin
    .firestore()
    .collection(DB_ENDPOINTS.messages)
    .where('email', '==', email)
    .count()
    .get()

  const count = userReq.data().count

  return count >= EMAIL_ADDRESS_SEND_LIMIT
}

export const handleSendMessage = async (
  data: SendMessage,
  context: functions.https.CallableContext,
) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated')
  }

  if (await isBlocked(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'User is Blocked')
  }

  if (await reachedLimit(context.auth.token.email)) {
    throw new functions.https.HttpsError('resource-exhausted', 'Limit exceeded')
  }

  const newMessage = createDoc({
    isSent: false,
    toUserName: data.to,
    email: context.auth.token.email,
    message: data.message,
    text: data.message,
  })

  await firebaseAdmin
    .firestore()
    .collection(DB_ENDPOINTS.messages)
    .doc()
    .set(newMessage)
}

export const sendMessage = functions
  .runWith({
    memory: '512MB',
  })
  .https.onCall(handleSendMessage)
