import * as functions from 'firebase-functions'
import { IHowtoDB, IMapPin, IMessageDB } from '../../../src/models'
import { IModerationStatus } from 'oa-shared'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import {
  getHowToSubmissionEmail,
  getMapPinSubmissionEmail,
  getReceiverMessageEmail,
  getSenderMessageEmail,
} from './templateHelpers'
import { getUserAndEmail, isValidMessageRequest } from './utils'
import { withErrorAlerting } from '../alerting/errorAlerting'

export async function createMessageEmails(message: IMessageDB) {
  const isValid = await isValidMessageRequest(message)
  if (!isValid) {
    return
  }

  const { _id, isSent, email, toUserName } = message

  if (!isSent) {
    const { toUserEmail } = await getUserAndEmail(toUserName)
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      replyTo: email,
      message: getReceiverMessageEmail(message),
    })
    await db.collection(DB_ENDPOINTS.emails).add({
      to: email,
      message: getSenderMessageEmail(message),
    })
    await db
      .collection(DB_ENDPOINTS.messages)
      .doc(_id)
      .set({ ...message, isSent: true })
  }
}

export async function createHowtoSubmissionEmail(howto: IHowtoDB) {
  const { toUser, toUserEmail } = await getUserAndEmail(howto._createdBy)

  if (howto.moderation === IModerationStatus.AWAITING_MODERATION) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getHowToSubmissionEmail(toUser, howto),
    })
  }
}

export async function createMapPinSubmissionEmail(mapPin: IMapPin) {
  const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)

  if (mapPin.moderation === IModerationStatus.AWAITING_MODERATION) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getMapPinSubmissionEmail(toUser, mapPin),
    })
  }
}

export const handleMessageSubmission = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.messages}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createMessageEmails, [snapshot.data()]),
  )

export const handleHowToSubmission = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createHowtoSubmissionEmail, [snapshot.data()]),
  )

export const handleMapPinSubmission = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createMapPinSubmissionEmail, [snapshot.data()]),
  )
