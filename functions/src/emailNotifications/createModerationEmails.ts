import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IHowtoDB, IMapPin, IModerable } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { getHowToApprovalEmail, getMapPinApprovalEmail } from './templates'
import { getUserAndEmail } from './utils'
import { Change } from 'firebase-functions/v1'

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
        message: getHowToApprovalEmail(toUser, howto),
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
        message: getMapPinApprovalEmail(toUser, mapPin),
      })
    }
  }
}
