import * as functions from 'firebase-functions'
import { db, getDoc } from '../Firebase/firestoreDB'
import {
  IUserDB,
  IDBDocChange,
  DB_ENDPOINTS,
  IHowtoDB,
  IEventDB,
} from '../models'
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
/**
 * When a moderation status changes (including first created or deleted)
 * update user stats to reflect content they have created
 */
async function updateStats(
  change: IDBDocChange,
  target: keyof IUserDB['stats'],
) {
  const after: IHowtoDB | IEventDB = change.after.data() || ({} as any)
  const before: IHowtoDB | IEventDB = change.before.data() || ({} as any)
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
      }
      if (target === 'userCreatedEvents' || target === 'userCreatedHowtos')
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
