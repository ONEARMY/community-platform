import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { db } from '../Firebase/firestoreDB'
import {
  IUserDB,
  IDBDocChange,
  DB_ENDPOINTS,
  IHowtoDB,
  IResearchDB,
  IEventDB,
  IHowtoStats,
  IResearchStats,
} from '../models'
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
    await updateHowtoVoteStats(change)
  })

exports.ResearchStatsCountVotes = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, context) => {
    await updateResearchVoteStats(change)
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
  const after: IResearchDB | IHowtoDB | IEventDB = change.after.data() || ({} as any)
  const before: IResearchDB | IHowtoDB | IEventDB = change.before.data() || ({} as any)
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
      if (target === 'userCreatedEvents' || target === 'userCreatedHowtos' || target === 'userCreatedResearch')
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

/**
 * When a user's doc is updated check in case the user has made any changes to the field
 * where they track howtos that they have marked as useful, and update the specific counter
 * on the howto to reflect the change
 */
async function updateHowtoVoteStats(change: IDBDocChange) {
  // as a user may not have voted before so make sure to handle empty case also
  // also will be triggered on user creation so handle case where user does not exist before
  const votedBefore = (change.before.data() as IUserDB)?.votedUsefulHowtos || {}
  const votedAfter = (change.after.data() as IUserDB)?.votedUsefulHowtos || {}
  // look for changes to votes, there should only be one but run but run multiple in parallel in case
  const updates = Object.keys(votedAfter).map(async howtoId => {
    if (votedAfter[howtoId] !== votedBefore[howtoId]) {
      // both true and false values are stored (to make it easier to unvote)
      // so increment counter by +/-1 depending on updated value using firebase increment utility
      const counterChange = votedAfter[howtoId] ? 1 : -1
      const update: Partial<IHowtoStats> = {
        votedUsefulCount: admin.firestore.FieldValue.increment(
          counterChange,
        ) as any,
      }
      const howtoStatsRef = db
        .collection(DB_ENDPOINTS.howtos)
        .doc(howtoId)
        .collection('stats')
        .doc('all')
      await howtoStatsRef.set(update, { merge: true })
    }
  })
  await Promise.all(updates)
}

/**
 * When a user's doc is updated check in case the user has made any changes to the field
 * where they track Research that they have marked as useful, and update the specific counter
 * on the Research to reflect the change
 */
 async function updateResearchVoteStats(change: IDBDocChange) {
  // as a user may not have voted before so make sure to handle empty case also
  // also will be triggered on user creation so handle case where user does not exist before
  const votedBefore = (change.before.data() as IUserDB)?.votedUsefulResearch || {}
  const votedAfter = (change.after.data() as IUserDB)?.votedUsefulResearch || {}
  // look for changes to votes, there should only be one but run multiple in parallel in case
  const updates = Object.keys(votedAfter).map(async researchId => {
    if (votedAfter[researchId] !== votedBefore[researchId]) {
      // both true and false values are stored (to make it easier to unvote)
      // so increment counter by +/-1 depending on updated value using firebase increment utility
      const counterChange = votedAfter[researchId] ? 1 : -1
      const update: Partial<IResearchStats> = {
        votedUsefulCount: admin.firestore.FieldValue.increment(
          counterChange,
        ) as any,
      }
      const ResearchStatsRef = db
        .collection(DB_ENDPOINTS.research)
        .doc(researchId)
        .collection('stats')
        .doc('all')
      await ResearchStatsRef.set(update, { merge: true })
    }
  })
  await Promise.all(updates)
}
