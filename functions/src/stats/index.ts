import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { IUserDB, IDBDocChange, DB_ENDPOINTS, IModerable } from '../models'
export * from './migration'

/**
 * User-generated content stats
 * Keep count of user contributions, including
 * - total howtos created
 * - total Research created
 * - total events created
 */

/********************************************************************
 * Triggered functions
 ********************************************************************/
exports.userStatsCountHowTos = functions.firestore
  .document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onUpdate(async (change, context) => {
    await updateContentCounterStats(change, 'userCreatedHowtos')
  })

exports.userStatsCountResearch = functions.firestore
  .document(`${DB_ENDPOINTS.research}/{id}`)
  .onUpdate(async (change, context) => {
    await updateContentCounterStats(change, 'userCreatedResearch')
  })

exports.userStatsCountEvents = functions.firestore
  .document(`${DB_ENDPOINTS.events}/{id}`)
  .onUpdate(async (change, context) => {
    await updateContentCounterStats(change, 'userCreatedEvents')
  })

exports.howtoStatsCountVotes = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, context) => {
    // DEPRECATED - 2022-02-19
    // replaced with aggregations, should be removed in future update (breaking change)
  })

/********************************************************************
 * Helper functions
 ********************************************************************/
/**
 * When a moderation status changes (including first created or deleted)
 * update user stats to reflect content they have created
 */
async function updateContentCounterStats(
  change: IDBDocChange,
  target: keyof IUserDB['stats'],
) {
  const after: IModerable = change.after.data() || ({} as any)
  const before: IModerable = change.before.data() || ({} as any)
  if (after.moderation !== before.moderation) {
    const userDoc = await db
      .collection(DB_ENDPOINTS.users)
      .doc(after._createdBy)
      .get()
    // only update if a user exists and stats have changed
    if (userDoc.exists) {
      const user = userDoc.data() as IUserDB
      user.stats = user.stats || {
        userCreatedEvents: {},
        userCreatedHowtos: {},
        userCreatedResearch: {},
      }
      if (
        target === 'userCreatedEvents' ||
        target === 'userCreatedHowtos' ||
        target === 'userCreatedResearch'
      )
        user.stats[target] = {
          ...user.stats[target],
          [after._id]: after.moderation,
        }
      await userDoc.ref.set(user, { merge: true })
    } else {
      throw new Error(
        'could not find user to update stats: ' + after._createdBy,
      )
    }
  }
}
