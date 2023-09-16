import { EmailNotificationFrequency } from 'oa-shared'
import { IHowtoDB } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { getHowToApprovalEmail } from './templates'
import { getUserEmail } from './utils'

export const handleHowToModerationUpdate = async (change) => {
  const howto = change.after.exists ? change.after.data() : null
  const prevHowTo = change.before.exists ? change.before.data() : null
  const prevModeration = prevHowTo?.moderation
  const currModeration = howto?.moderation
  if (currModeration && prevModeration !== currModeration) {
    await createHowtoModerationEmail(howto)
  }
}

export async function createHowtoModerationEmail(howto: IHowtoDB) {
  const userName = howto._createdBy
  const toUserDoc = (await db
    .collection(DB_ENDPOINTS.users)
    .doc(userName)
    .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

  const toUser = toUserDoc.exists ? toUserDoc.data() : undefined
  const toUserEmail = toUser ? await getUserEmail(toUser._authID) : undefined

  if (!toUser || !toUserEmail) {
    throw new Error(`Cannot get user ${userName}`)
  }

  if (
    toUser.notification_settings?.emailFrequency !==
    EmailNotificationFrequency.NEVER
  ) {
    if (howto.moderation === 'accepted') {
      await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: getHowToApprovalEmail(toUser, howto),
      })
    }
  }
}
