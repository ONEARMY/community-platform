import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { IUserDB, IDBDocChange, DB_ENDPOINTS } from '../models'
export * from './migration'

/**
 * User-generated content stats
 * Keep count of user contributions, including
 * - total howtos created
 * - total events created
 */

/********************************************************************
 * Triggered functions
 ********************************************************************/
export const countHowTos = functions.firestore
  .document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onWrite(async (change, context) => {
    await updateStats(change, 'userCreatedHowtos')
  })

export const countEvents = functions.firestore
  .document(`${DB_ENDPOINTS.events}/{id}`)
  .onWrite(async (change, context) => {
    await updateStats(change, 'userCreatedEvents')
  })

/********************************************************************
 * Helper functions
 ********************************************************************/
async function updateStats(
  change: IDBDocChange,
  target: keyof IUserDB['stats'],
) {
  const info = change.after.exists ? change.after.data() : null
  const prevInfo = change.before.exists ? change.before.data() : null
  const delta = calculateStatsChange(info, prevInfo)
  const userDoc = await db
    .collection(DB_ENDPOINTS.users)
    .doc(info._createdBy)
    .get()
  // only update if a user exists and stats have changed
  if (userDoc.exists && delta !== 0) {
    console.log('Update ', info._createdBy, ' ', target, ' delta: ', delta)
    const user = userDoc.data() as IUserDB
    if (!user.stats[target]) {
      user.stats[target] = 0
    }
    user.stats[target] += delta
    await userDoc.ref.set(user, { merge: true })
  }
}

/**
 * Determine the change to a users stat counts given the updated howto or event
 */
function calculateStatsChange(
  info: FirebaseFirestore.DocumentData = {},
  prevInfo: FirebaseFirestore.DocumentData = {},
) {
  let delta = 0
  if (info.moderation === 'accepted' && prevInfo.Moderation !== 'accepted') {
    // Increment if now accepted and previously different
    delta = 1
  }
  if (prevInfo.moderation === 'accepted' && info.moderation !== 'accepted') {
    // Decrement if previously accepted and now erased or moderation changed
    delta = -1
  }
  return delta
}
