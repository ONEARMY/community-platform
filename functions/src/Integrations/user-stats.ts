import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'


export const countHowTos = functions.firestore
  .document('v3_howtos/{id}')
  .onWrite(async (change, context) => {

    updateStats(change, 'v3_howtos', 'howToCount')

  })

export const countEvents = functions.firestore
  .document('v3_events/{id}')
  .onWrite(async (change, context) => {

    updateStats(change, 'v3_events', 'eventCount')

  })

function updateStats(change, collection, target){

  const info = change.after.exists ? change.after.data() : null
  const prevInfo = change.before.exists ? change.before.data() : null
  const userStatsRef = db.collection('v3_users/');

  let delta = 0

  if (info !== null && info.moderation === 'accepted' && prevInfo !== null && prevInfo.Moderation !== 'accepted') { // Increment if now accepted and previously different
    delta = 1
  } else if (prevInfo !== null && prevInfo.moderation === 'accepted' && (info === null || info.moderation !== 'accepted')) { // Decrement if previously accepted and now erased or moderation changed
    delta = -1
  } else {
    return null
  }

  console.log('Update ', collection, ' delta: ', delta )

  return userStatsRef.doc(info._createdBy).update({'stats':{
    [target]: admin.firestore.FieldValue.increment(delta)
  }}).catch(e => {
    console.log(e);
    // In case stats for user are inexistent we compute from all his records, Only triggers if no user exist (new Collection)
    // computeUserStats(info._createdBy)
  })
}

// Compute one user stats
function computeUserStats(owner){

  const userStatsRef = db.collection('v3_users/')

  db.collection('v3_howtos').where("_createdBy", "==", owner).where("moderation", "==", "accepted")
  .get()
  .then(querySnapshot => {
    let count = 0;
    querySnapshot.forEach(doc => {
      count++;
    });
    console.log('Accepted howtos for', owner ,',count: ', count);
    userStatsRef.doc(owner).set({'stats':{
      howToCount: count
    }}, {merge: true});
    return null
  }).catch(() => null);

  db.collection('v3_events').where("_createdBy", "==", owner).where("moderation", "==", "accepted")
  .get()
  .then(querySnapshot => {
    let count = 0;
    querySnapshot.forEach(doc => {
      count++;
    });
    console.log('Accepted events for', owner ,',count: ', count);
    userStatsRef.doc(owner).set({'stats':{
      eventCount: count
    }}, {merge: true});
    return null
  }).catch(() => null);
}

