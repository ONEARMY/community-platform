import * as functions from 'firebase-functions'
import { IModerationStatus } from 'oa-shared'

import { withErrorAlerting } from '../alerting/errorAlerting'
import { MEMORY_LIMIT_512_MB } from '../consts'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import * as templates from './templateHelpers'

import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import type { Change } from 'firebase-functions/v1'
import type { IModerable } from 'oa-shared'
import type { IMapPin } from 'oa-shared/models/maps'

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

// TODO migrate
export async function createMapPinModerationEmail(mapPin: IMapPin) {
  // const { toUser, toUserEmail } = await getUserAndEmail(mapPin._id)
  // if (mapPin.moderation === IModerationStatus.ACCEPTED) {
  //   await db.collection(DB_ENDPOINTS.emails).add({
  //     to: toUserEmail,
  //     message: templates.getMapPinApprovalEmail(toUser, mapPin),
  //   })
  // } else if (mapPin.moderation === IModerationStatus.AWAITING_MODERATION) {
  //   // If a pin is resumbitted, send another submission confirmation email.
  //   await db.collection(DB_ENDPOINTS.emails).add({
  //     to: toUserEmail,
  //     message: templates.getMapPinSubmissionEmail(toUser, mapPin),
  //   })
  // } else if (mapPin.moderation === IModerationStatus.REJECTED) {
  //   await db.collection(DB_ENDPOINTS.emails).add({
  //     to: toUserEmail,
  //     message: templates.getMapPinRejectedEmail(toUser),
  //   })
  // } else if (mapPin.moderation === IModerationStatus.IMPROVEMENTS_NEEDED) {
  //   await db.collection(DB_ENDPOINTS.emails).add({
  //     to: toUserEmail,
  //     message: templates.getMapPinNeedsImprovementsEmail(toUser, mapPin),
  //   })
  // }
}

export const handleMapPinModerationUpdate = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .firestore.document(`${DB_ENDPOINTS.mappins}/{id}`)
  .onUpdate((change, context) =>
    withErrorAlerting(context, handleModerationUpdate, [
      change,
      createMapPinModerationEmail,
    ]),
  )
