import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'

export const countHowTos = functions.firestore
  .document('v3_howtos/{id}')
  .onWrite(async (change, context) => {
    updateStats(change, 'howToCount')
  })

export const countEvents = functions.firestore
  .document('v3_events/{id}')
  .onWrite(async (change, context) => {
    updateStats(change, 'eventCount')
  })

async function updateStats(change, target) {
  const info = change.after.exists ? change.after.data() : null
  const prevInfo = change.before.exists ? change.before.data() : null
  const userStatsRef = db.collection('v3_users/')

  let delta = 0

  if (
    info !== null &&
    info.moderation === 'accepted' &&
    prevInfo !== null &&
    prevInfo.Moderation !== 'accepted'
  ) {
    // Increment if now accepted and previously different
    delta = 1
  } else if (
    prevInfo !== null &&
    prevInfo.moderation === 'accepted' &&
    (info === null || info.moderation !== 'accepted')
  ) {
    // Decrement if previously accepted and now erased or moderation changed
    delta = -1
  } else {
    return null
  }

  console.log('Update ', info._createdBy, ' ', target, ' delta: ', delta)

  const user: any = await userStatsRef.doc(info._createdBy).get()
  let stats = null
  if (user && user.exists) {
    if (!user.data().stats || (!(target in user.data().stats) && delta<0 ) ){
      console.log('No previous stats for ' + user.id + ' -> compute')
      stats = await computeUserStats(info._createdBy)
      console.log(user.id, ': ', stats)
    } else {
      stats = user.data().stats;
      if (!(target in stats)) stats[target] = delta > 0 ? delta : 0;  // Should never happen
      stats[target] += delta;
    }
    if (stats) {
      user.ref
        .update(
          {
            stats: stats,
          },
          { merge: true },
        )
        .then(() => {
          return true
        })
        .catch(e => {
          console.error('Could not update user stats, error: ', e)
        })
    }
  } else {
    console.error(
      'Fatal(updateStats): user not found for ',
      target,
      ': ',
      info._createdBy,
    )
  }
  return false
}

// Compute one user stats
async function computeUserStats(owner) {
  console.log('Calculando para ', owner)

  try {
    const snapshotHowTos: any = await db
      .collection('v3_howtos')
      .where('_createdBy', '==', owner)
      .where('moderation', '==', 'accepted')
      .get();

    const snapshotEvents: any = await db
      .collection('v3_events')
      .where('_createdBy', '==', owner)
      .where('moderation', '==', 'accepted')
      .get();

    const stats: any = {
        howToCount : snapshotHowTos ? snapshotHowTos.size : 0,
        eventCount : snapshotEvents ? snapshotEvents.size : 0
    };

    return stats
  } catch (e) {
    console.error('Error compute:', e)
  }
  return null
}
