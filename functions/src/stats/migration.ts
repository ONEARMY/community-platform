import * as functions from 'firebase-functions'
import { IUserDB, IHowtoDB, IEventDB, DB_ENDPOINTS } from '../models'
import { db, getCollection } from '../Firebase/firestoreDB'

/**
 * One-off script to migrate legacy content to new format
 * Once run this code will be deprecated, but retained in case
 * it can be used in future migrations
 */
export const migrateUserStats = functions.https.onCall(
  async (data, context) => {
    // Calculate how many events and howtos have been created by each user,
    // and populate to a user.stats object accordingly
    const allEvents = await getCollection('events')
    const allEventsByUser = calcUserEvents(allEvents as any[])
    const allHowtos = await getCollection('howtos')
    const allHowtosByUser = calcUserHowtos(allHowtos as any[])
    // create a unique array of users identifies from event and howto calc functions
    const usersToUpdate = [
      ...new Set([
        ...Object.keys(allHowtosByUser),
        ...Object.keys(allEventsByUser),
      ]),
    ]
    // use hardcoded endpoint as this has now been updated in models to reflect new revision
    // const allUsers: IUserDB[] = await getCollection('v3_users' as any)
    // console.log(`migrating [${allUsers.length}] users`)
    const batch = db.batch()
    const operations = { updated: [], skipped: [] }
    for (const userId of usersToUpdate) {
      const ref = db.collection(DB_ENDPOINTS.users).doc(userId)
      const userDoc = (await ref.get()).data()
      if (userDoc) {
        const update: Partial<IUserDB> = {
          stats: {
            userCreatedEvents: allEventsByUser[userId] || {},
            userCreatedHowtos: allHowtosByUser[userId] || {},
          },
          _modified: new Date().toISOString(),
        }
        operations.updated.push({ ...update, _id: userId })
        batch.update(ref, update)
      } else {
        operations.skipped.push({ _id: userId })
        console.error('cannot find user', userId)
      }
    }
    if (data.write) {
      await batch.commit()
    }
    return {
      _write: data.write,
      operations,
      meta: { allHowtosByUser, allHowtos, allEventsByUser, allEvents },
    }
    /**
     * No longer required - chunking writes
     */
    //   // split updates into chunks with sleep between commits to comply with firebase max writes
    //   // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions
    //   const writeChunks = _splitArrayToChunks<any>(userUpdates, 500)
    //   for (const chunk of writeChunks) {
    //     const batch = db.batch()
    //     chunk.forEach(user =>

    //     )
    //     await batch.commit()
    //     await _sleep(1000)
    //   }
    // }
  },
)

/****************************************************************
 * Helper functions
 ****************************************************************/
/**
 * Create a hashmap all all howtos, keyed by id and value moderation status
 */
function calcUserHowtos(howtos: IHowtoDB[]) {
  const allHowTosByUser = {}
  howtos.forEach(v => {
    const createdBy = v._createdBy || '_anonymous'
    allHowTosByUser[createdBy] = allHowTosByUser[createdBy] || {}
    allHowTosByUser[createdBy][v._id] = v.moderation
  })
  console.log('allHowTosByUser', allHowTosByUser)
  return allHowTosByUser
}
/**
 * Create a hashmap all events,  keyed by id and value moderation status
 */
function calcUserEvents(events: IEventDB[]) {
  const allEventsByUser = {}
  events.forEach(v => {
    const createdBy = v._createdBy || '_anonymous'
    allEventsByUser[createdBy] = allEventsByUser[createdBy] || {}
    allEventsByUser[createdBy][v._id] = v.moderation
  })
  return allEventsByUser
}


function _sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
