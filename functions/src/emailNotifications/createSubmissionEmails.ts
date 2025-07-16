import * as functions from 'firebase-functions'

import { withErrorAlerting } from '../alerting/errorAlerting'
import { DB_ENDPOINTS } from '../models'

import type { IMapPin } from 'oa-shared'

// TODO: migrate
export async function createMapPinSubmissionEmail(mapPin: IMapPin) {
  // const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)
  // if (mapPin.moderation === IModerationStatus.AWAITING_MODERATION) {
  //   await db.collection(DB_ENDPOINTS.emails).add({
  //     to: toUserEmail,
  //     message: getMapPinSubmissionEmail(toUser, mapPin),
  //   })
  // }
}

export const handleMapPinSubmission = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onCreate((snapshot, context) =>
    withErrorAlerting(context, createMapPinSubmissionEmail, [snapshot.data()]),
  )
