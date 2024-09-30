import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { getUserEmail } from './utils'
import { DB_ENDPOINTS } from 'oa-shared/models/db'
import { getUserVerifiedBadgeAddedEmail } from './templateHelpers'
import { withErrorAlerting } from '../alerting/errorAlerting'
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IUserDB } from 'oa-shared/models/user'

export const handleUserVerifiedBadgeUpdate = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change, ctx) =>
    withErrorAlerting(ctx, handleUserVerifiedBadgeChange, [change]),
  )

const handleUserVerifiedBadgeChange = async (
  change: functions.Change<QueryDocumentSnapshot<IUserDB>>,
) => {
  const after = change.after.exists ? change.after.data() : null
  const before = change.before.exists ? change.before.data() : null
  const toUserEmail = after ? await getUserEmail(after._authID) : null

  if (!before.badges?.verified && after.badges?.verified === true) {
    await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getUserVerifiedBadgeAddedEmail(after),
    })
  }
}
