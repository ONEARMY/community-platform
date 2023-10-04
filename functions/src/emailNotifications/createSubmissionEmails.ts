import * as functions from 'firebase-functions'
import { IHowtoDB, IMapPin } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { getHowToSubmissionEmail, getMapPinSubmissionEmail } from './templates'
import { getUserAndEmail } from './utils'
import { withErrorAlerting } from '../alerting/errorAlerting'

export async function createHowtoSubmissionEmail(howto: IHowtoDB) {
  const { toUser, toUserEmail } = await getUserAndEmail(howto._createdBy)

  // Release first under beta to test.
  if (toUser.userRoles?.includes('beta-tester')) {
    if (howto.moderation === 'awaiting-moderation') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: getHowToSubmissionEmail(toUser, howto),
      })
    }
  }
}

export async function createMapPinSubmissionEmail(mapPin: IMapPin) {
  const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)

  // Release first under beta to test.
  if (toUser.userRoles?.includes('beta-tester')) {
    if (mapPin.moderation === 'awaiting-moderation') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: getMapPinSubmissionEmail(toUser, mapPin),
      })
    }
  }
}

export const handleHowToSubmission = functions.firestore
  .document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createHowtoSubmissionEmail, [snapshot.data()]),
  )

export const handleMapPinSubmission = functions.firestore
  .document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createMapPinSubmissionEmail, [snapshot.data()]),
  )
