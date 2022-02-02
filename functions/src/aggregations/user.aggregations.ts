import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { db } from '../Firebase/firestoreDB'
import { shallowCompareObjectsEqual } from '../Utils/data.utils'

/** Aggregate a single list of all users with badges */
exports.badges = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async change => {
    const id = change.after.id
    const user = change.after.data() as IUserDB
    if (user) {
      await updateUserBadges(id, user)
    }
  })

async function updateUserBadges(id: string, user: IUserDB) {
  const ref = db.collection(DB_ENDPOINTS.aggregations).doc('user_badges')
  const doc = await ref.get()
  if (!doc.exists) {
    await seedUserBadges(ref)
  }
  const userBadges = doc.data()
  // handle user badges changed - set if user has badges, delete if not
  if (shallowCompareObjectsEqual(user.badges, userBadges[id])) {
    ref.update({ [id]: user.badges || admin.firestore.FieldValue.delete() })
  }
}

/**
 * Calculate baseline aggregation across all users instead of incremental update
 * Useful for first-time intialisation or handling future breaking changes
 */
async function seedUserBadges(ref: FirebaseFirestore.DocumentReference) {
  const snapshot = await db
    .collection(DB_ENDPOINTS.users)
    .orderBy('badges') // this will also filter to include only users with badges
    .get()
  const allUserBadges = {}
  for (const user of snapshot.docs) {
    allUserBadges[user.id] = user.data().badges
  }
  return ref.set(allUserBadges, { merge: false })
}
