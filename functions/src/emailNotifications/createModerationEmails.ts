import * as functions from 'firebase-functions'
import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IHowtoDB, IMapPin, IModerable } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import * as templates from './templates'
import { getUserAndEmail } from './utils'
import { Change } from 'firebase-functions/v1'
import { withErrorAlerting } from '../alerting/errorAlerting'
import { EMAIL_FUNCTION_MEMORY_LIMIT } from './utils'

export async function handleModerationUpdate<T extends IModerable>(
  change: Change<QueryDocumentSnapshot<T>>,
  createModerationEmail: (item: T) => Promise<void>,
) {
  const curr = change.after.exists ? change.after.data() : null
  const prev = change.before.exists ? change.before.data() : null
  const prevModeration = prev?.moderation
  const currModeration = curr?.moderation
  if (currModeration && prevModeration !== currModeration) {
    await createModerationEmail(curr)
  }
}

export async function createHowtoModerationEmail(howto: IHowtoDB) {
  const { toUser, toUserEmail } = await getUserAndEmail(howto._createdBy)
  // Release first under beta to test.
  if (toUser.userRoles?.includes('beta-tester')) {
    if (howto.moderation === 'accepted') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getHowToApprovalEmail(toUser, howto),
      })
    } else if (howto.moderation === 'awaiting-moderation') {
      // If a how to is resumbitted, send another submission confirmation email.
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getHowToSubmissionEmail(toUser, howto),
      })
    } else if (howto.moderation === 'rejected') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getHowToRejectedEmail(toUser, howto),
      })
    } else if (howto.moderation === 'improvements-needed') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getHowToNeedsImprovementsEmail(toUser, howto),
      })
    }
  }
}

export async function createMapPinModerationEmail(mapPin: IMapPin) {
  const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)

  // Release first under beta to test.
  if (toUser.userRoles?.includes('beta-tester')) {
    if (mapPin.moderation === 'accepted') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getMapPinApprovalEmail(toUser, mapPin),
      })
    } else if (mapPin.moderation === 'awaiting-moderation') {
      // If a pin is resumbitted, send another submission confirmation email.
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getMapPinSubmissionEmail(toUser, mapPin),
      })
    } else if (mapPin.moderation === 'rejected') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getMapPinRejectedEmail(toUser),
      })
    } else if (mapPin.moderation === 'improvements-needed') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: templates.getMapPinNeedsImprovementsEmail(toUser, mapPin),
      })
    }
  }
}

export const handleHowToModerationUpdate = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .firestore.document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onUpdate((change, context) =>
    withErrorAlerting(context, handleModerationUpdate, [
      change,
      createHowtoModerationEmail,
    ]),
  )

export const handleMapPinModerationUpdate = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .firestore.document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onUpdate((change, context) =>
    withErrorAlerting(context, handleModerationUpdate, [
      change,
      createMapPinModerationEmail,
    ]),
  )
