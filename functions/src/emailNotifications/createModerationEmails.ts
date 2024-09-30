import * as functions from 'firebase-functions'
import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IModerationStatus, IModerable } from 'oa-shared'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import * as templates from './templateHelpers'
import { getUserAndEmail } from './utils'
import { Change } from 'firebase-functions/v1'
import { withErrorAlerting } from '../alerting/errorAlerting'
import { MEMORY_LIMIT_512_MB } from '../consts'
import { IHowtoDB } from 'oa-shared/models/howto'
import { IMapPin } from 'oa-shared/models/maps'

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

  if (howto.moderation === IModerationStatus.ACCEPTED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getHowToApprovalEmail(toUser, howto),
    })
  } else if (howto.moderation === IModerationStatus.AWAITING_MODERATION) {
    // If a how to is resumbitted, send another submission confirmation email.
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getHowToSubmissionEmail(toUser, howto),
    })
  } else if (howto.moderation === IModerationStatus.REJECTED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getHowToRejectedEmail(toUser, howto),
    })
  } else if (howto.moderation === IModerationStatus.IMPROVEMENTS_NEEDED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getHowToNeedsImprovementsEmail(toUser, howto),
    })
  }
}

export async function createMapPinModerationEmail(mapPin: IMapPin) {
  const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)

  if (mapPin.moderation === IModerationStatus.ACCEPTED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getMapPinApprovalEmail(toUser, mapPin),
    })
  } else if (mapPin.moderation === IModerationStatus.AWAITING_MODERATION) {
    // If a pin is resumbitted, send another submission confirmation email.
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getMapPinSubmissionEmail(toUser, mapPin),
    })
  } else if (mapPin.moderation === IModerationStatus.REJECTED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getMapPinRejectedEmail(toUser),
    })
  } else if (mapPin.moderation === IModerationStatus.IMPROVEMENTS_NEEDED) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: templates.getMapPinNeedsImprovementsEmail(toUser, mapPin),
    })
  }
}

export const handleHowToModerationUpdate = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .firestore.document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onUpdate((change, context) =>
    withErrorAlerting(context, handleModerationUpdate, [
      change,
      createHowtoModerationEmail,
    ]),
  )

export const handleMapPinModerationUpdate = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .firestore.document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onUpdate((change, context) =>
    withErrorAlerting(context, handleModerationUpdate, [
      change,
      createMapPinModerationEmail,
    ]),
  )
