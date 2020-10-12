import * as functions from 'firebase-functions'
import { DB_PREFIX, IUserDB, IHowtoDB, IEventDB } from '../models'
import { db } from '../Firebase/firestoreDB'

/**
 * One-off script to migrate legacy content to new format
 * Once run this code will be deprecated, but retained in case
 * it can be used in future migrations
 */
export const migrateUserStats = functions.https.onCall(
  async (data, context) => {
    // Calculate how many events and howtos have been created by each user,
    // and populate to a user.stats object accordingly
    const allEvents = await db.collection(`${DB_PREFIX}_events`).get()
    const allEventsByUser = calcUserEventCounts(allEvents.docs as any[])
    const allHowtos = await db.collection(`${DB_PREFIX}_howtos`).get()
    const allHowtosByUser = calcUserHowtoCounts(allHowtos.docs as any[])
    const allUsers = await db.collection(`${DB_PREFIX}_users`).get()
    const userMigration = allUsers.docs.map(d => {
      const user = d.data() as IUserDB
      user.stats = {
        userCreatedEvents: allEventsByUser[user._id] || 0,
        userCreatedHowtos: allHowtosByUser[user._id] || 0,
      }
      // skip updating timestamps as writing to new endpoint
      // user._modified = new Date().toISOString()
      return user
      // TODO - add default stats to new user creation (not this file but just to remember)
    })
    // split updates into chunks with sleep between commits to comply with firebase max writes
    // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions
    const writeChunks = _splitArrayToChunks<IUserDB>(userMigration, 500)
    for (const chunk of writeChunks) {
      const batch = db.batch()
      chunk.forEach(user =>
        batch.update(db.collection('v4_users').doc(user._id), user),
      )
      await batch.commit()
      await _sleep(1000)
    }
  },
)

/****************************************************************
 * Helper functions
 ****************************************************************/
/**
 * Create a hashmap all all howtos with a count of users
 */
function calcUserHowtoCounts(howtos: IHowtoDB[]) {
  const allHowTosByUser = {}
  howtos.forEach(v => {
    const createdBy = v._createdBy || 'anonymous'
    allHowTosByUser[createdBy] = allHowTosByUser[createdBy] || 0
    allHowTosByUser[createdBy]++
  })
  console.log('allHowTosByUser', allHowTosByUser)
  return allHowTosByUser
}
/**
 * Create a hashmap all events with a count of users
 */
function calcUserEventCounts(events: IEventDB[]) {
  const allEventsByUser = {}
  events.forEach(v => {
    const createdBy = v._createdBy || 'anonymous'
    allEventsByUser[createdBy] = allEventsByUser[createdBy] || 0
    allEventsByUser[createdBy]++
  })
  return allEventsByUser
}
/**
 * Take a given array length n and split into an array of arrays, each with a maximum
 * length provided by @param chunksize
 */
function _splitArrayToChunks<T>(arr: T[], chunksize: number): T[][] {
  let chunkedArrays = []
  for (let i = 0; i < arr.length; i += chunksize) {
    chunkedArrays = arr.slice(i, i + chunksize)
  }
  return chunkedArrays
}

function _sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
