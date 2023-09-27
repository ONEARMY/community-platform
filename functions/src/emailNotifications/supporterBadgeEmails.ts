import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { getUserEmail } from './utils'
import { DB_ENDPOINTS } from 'oa-shared'
import {
  getUserSupporterBadgeAddedEmail,
  getUserSupporterBadgeRemovedEmail,
} from './templates'
import type { IUserDB } from '../models'
import { withErrorAlerting } from '../alerting/errorAlerting'
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'

exports.handleUserSupporterBadgeUpdate = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change, ctx) =>
    withErrorAlerting(ctx, handleUserSupporterBadgeChange, [change]),
  )

const handleUserSupporterBadgeChange = async (
  change: functions.Change<QueryDocumentSnapshot<IUserDB>>,
) => {
  const after = change.after.exists ? change.after.data() : null
  const before = change.before.exists ? change.before.data() : null
  const toUserEmail = after ? await getUserEmail(after._authID) : null

  if (before.badges?.supporter === false && after.badges?.supporter === true) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getUserSupporterBadgeAddedEmail(after),
    })
  }

  if (before.badges?.supporter === true && after.badges?.supporter === false) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getUserSupporterBadgeRemovedEmail(after),
    })
  }
}
