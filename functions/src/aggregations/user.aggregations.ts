import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { db } from '../Firebase/firestoreDB'

/** Aggregate a single list of all users with badges */
exports.badges = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async change => {
    const id = change.after.id
    const user = change.after.data() as IUserDB
    if (user) {
      const ref = db.collection(DB_ENDPOINTS.aggregations).doc('user_badges')
      const { exists, data: userBadgeData } = await ref.get()
      // handle first-time intialisation
      if (!exists) {
        await initialiseUserBadges()
      }
      const userBadges = userBadgeData()
      // handle user badges changed - set if user has badges, delete if not
      if (user.badges !== userBadges[id]) {
        ref.update({ [id]: user.badges || admin.firestore.FieldValue.delete() })
      }
    }
  })

async function initialiseUserBadges() {}
