import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IHowtoDB, IMapPin, IModerable } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { getHowToApprovalEmail, getMapPinApprovalEmail } from './templates'
import { getUserEmail } from './utils'
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

async function getUserFromModerable<T extends IModerable>(moderable: T) {
  const userName = moderable._createdBy
  const toUserDoc = (await db
    .collection(DB_ENDPOINTS.users)
    .doc(userName)
    .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

  const toUser = toUserDoc.exists ? toUserDoc.data() : undefined
  const toUserEmail = toUser ? await getUserEmail(toUser._authID) : undefined

  if (!toUser || !toUserEmail) {
    throw new Error(`Cannot get user ${userName}`)
  }

  return { toUser, toUserEmail }
}

export async function createHowtoModerationEmail(howto: IHowtoDB) {
  const { toUser, toUserEmail } = await getUserFromModerable(howto)

  // Release first under beta to test.
  if (toUser.userRoles?.includes('beta-tester')) {
    let message
    if (howto.moderation === 'accepted') {
      message = getHowToApprovalEmail(toUser, howto)
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: getHowToApprovalEmail(toUser, howto),
      })
    }
  }
}

export async function createMapPinModerationEmail(mapPin: IMapPin) {
  const { toUser, toUserEmail } = await getUserFromModerable(mapPin)

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
